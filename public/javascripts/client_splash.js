var main = function() {
    document.cookie = "nick=";
}

$(document).ready(main);

var nickName;

$(".input input").on("keypress", function(event) {
    if (event.keyCode === 13) {
        set_cookie(get_nick());
        $(".global").prop('disabled', false);
    }
});

var get_nick = function() {
    var text = $(".input input").val();
    if (text !== "") {
        $(".input input").val("");

        $(".input .status").text("Nickname set to: ");
        $(".input .name").text(text);
        return text;
    }
    else {
        return null;
    }
}

var set_cookie = function(nick) {
    if (nick !== null) {
        document.cookie = "nick="+nick;
        console.log("[COOKIE SET]");
    }
}