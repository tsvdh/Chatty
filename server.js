var express = require("express");
var http = require("http");
var websocket = require("ws");
var stats = require("./stats");
var Comment = require("./comment");
var User = require("./user");
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

var indexRouter = require("./routes/index");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("splash.ejs", { num_chatters : stats.people_chatting, num_messages : stats.messages_sent });
});
app.get("/chat", indexRouter);

//storage
var comments = [];
var users = [];
var duplicate = 1;

//websocket setup
var websockets = [];
const wss = new websocket.Server({ server });
var connectionID = -1;

//websocket interaction
wss.on("connection", function(ws) {
    stats.people_chatting++;

    console.log("[NEW CHATTER CONNECTED]");

    ws.id = connectionID++;
    
    websockets.push(ws);
    console.log("amount --> " + websockets.length);
    console.log(" ");

    //send all comments to current websocket
    for (var i = 0; i < comments.length; i++) {
        var outMsg = messages.O_SHOW_MESSAGE;
        outMsg.text = comments[i].getText();
        outMsg.nick = comments[i].getNick();
        ws.send(JSON.stringify(outMsg));
    }

    ws.onclose = function() {
        stats.people_chatting--;

       console.log("[CHATTER DISCONNECTED]");

        for (index = 0; index < websockets.length; index++) {
            if (ws.id === websockets[index].id) {
                websockets.splice(index, 1);
                break;
            }
        }

        console.log("amount --> " + websockets.length);
        console.log(" ");

        users.splice(users.indexOf(ws.nick), 1);
    }

    ws.onmessage = function incoming(msg) {
        var message = JSON.parse(msg.data);
        console.log("[NEW MESSAGE RECEIVED]");
        console.log("type --> " + message.type);
        console.log(" ");
        if (message.type === "POST_MESSAGE") {
            if (message.nick === ws.nick) {
                stats.messages_sent++;

                comments.push(new Comment(message.text, message.nick));

                var text = message.text;
                if (text.length > 50) {
                    text = text.slice(0, 51);
                }
                console.log("text --> " + text);
                console.log(" ");

                var outMsg = messages.O_SHOW_MESSAGE;
                outMsg.text = message.text;
                outMsg.nick = message.nick;
                websockets.forEach(function(socket) {
                    socket.send(JSON.stringify(outMsg));
                });
            }
            else {
                console.log("[NICKNAME MISMATCH]");
                console.log("--> message is ignored");
                console.log(" ");

                var outMsg = messages.O_KICKED;
                outMsg.reason = "Your nickname did not match the nickname on the server.";
                ws.send(JSON.stringify(outMsg));

                ws.close();
            }
        }
        if (message.type === "CHECK_NAME") {
            var multiple = false;
            var newNick = message.nick;

            users.forEach(function(user) {
                if (user === message.nick) {
                    multiple = true;
                }
            });

            if (multiple === true) {
                newNick += duplicate;
                duplicate++;

                var outMsg = messages.O_CHECK_NAME;
                outMsg.nick = newNick;
                ws.send(JSON.stringify(outMsg));
                console.log("[NAME CHANGED]");
                console.log(" ");
            }

            users.push(newNick);
            ws.nick = newNick;

            console.log("[USER ADDED]");
            console.log(" ");
        }
    }
});

server.listen(port);

console.log("[SERVER STARTED]");
console.log(" ");