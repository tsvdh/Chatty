(function(exports) {

    exports.T_CHECK_NAME = "CHECK_NAME";
    exports.O_CHECK_NAME = {
        type : exports.T_CHECK_NAME,
        nick : null
    }

    exports.T_POST_MESSAGE = "POST_MESSAGE";
    exports.O_POST_MESSAGE = {
        type : exports.T_POST_MESSAGE,
        text : null,
        nick : null
    }

    exports.T_SHOW_MESSAGE = "SHOW_MESSAGE";
    exports.O_SHOW_MESSAGE = {
        type : exports.T_SHOW_MESSAGE,
        text : null,
        nick : null
    }

    exports.T_KICKED = "KICKED";
    exports.O_KICKED = {
        type : exports.T_KICKED,
        reason : null
    }
} (typeof exports === "undefined" ? this.Messages = [] : exports));
//if exports is undefined, we are on the client, else on the server