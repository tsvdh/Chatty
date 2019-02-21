var socket;
var nickName;

var main = function() {

    //socket = new WebSocket("ws://chatt19.herokuapp.com:3001");
    socket = new WebSocket("ws://localhost:3001");

    socket.onopen = function() {
        console.log("[CONNECTED TO SERVER]");
        console.log(" ");
        set_nickname();
        check_nickname();
    }

    socket.onclose = function() {
        console.log("[DISCONNECTED FROM SERVER]");
        console.log(" ");
    }

    socket.onmessage = function incoming(msg) {
        console.log("[NEW MESSAGE RECEIVED]");
        var message = msg.data;
        process_message(JSON.parse(message));
    }
}

var set_nickname = function() {
    var cookie = document.cookie.split(";");
    nickName = cookie[0].split("=")[1];

    $(".input .nick").text("Your nickname: " + nickName);

    console.log("[NICKNAME SET]");
    console.log("nickname --> "+ nickName);
    console.log(" ");
}

var check_nickname = function() {
    var outMsg = Messages.O_CHECK_NAME;
    outMsg.nick = nickName;
    socket.send(JSON.stringify(outMsg));
}

var process_message = function(message) {
    console.log("--> " + message.type);
    console.log(" ");
    if (message.type === "SHOW_MESSAGE") {
        add_comment(message.text, message.nick);
    }
    if (message.type === "CHECK_NAME") {
        nickName = message.nick;

        document.cookie = "nick=" + nickName;

        $(".input .nick").text("Your nickname: " + nickName);

        console.log("[NICKNAME CHANGED]");
        console.log("nickname --> "+ nickName);
        console.log(" ");
    }
    if (message.type === "KICKED") {
        console.log("[YOU HAVE BEEN KICKED]");
        console.log("reason --> "+ message.reason);
    }
}

var get_message = function() {
    var input = $(".input textarea").val();
    if (input !== "") {
        $(".input textarea").val("");
        return input;
    }
    else {
        return null;
    }
}

$(".input button").on("click", function() {
    var input = get_message();
    if (input !== null) {
        var outMsg = Messages.O_POST_MESSAGE;
        outMsg.text = input;
        outMsg.nick = nickName;
        socket.send(JSON.stringify(outMsg));
        console.log("[COMMENT SENT]");
        console.log(" ");
    }
});

var add_comment = function(text, nick) {
    var $name = $("<li class=name></li>");
    var $comment = $("<li class=comment></li>");

    if (nick === nickName) {
        nick += " (You)";
    }

    $name.text(nick);
    $comment.text(text);

    $name.hide();
    $comment.hide();

    $("ul").prepend($comment);
    $("ul").prepend($name);

    $name.fadeIn();
    $comment.fadeIn();
}

var delete_cookie = function() {
    document.cookie = "nick=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

$(document).ready(main);