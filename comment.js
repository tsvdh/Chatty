var Comment = function(text, nick) {
    this.text = text;
    this.nick = nick;
}

Comment.prototype.getText = function() {return this.text};
Comment.prototype.getNick = function() {return this.nick};
Comment.prototype.setText = function(text) {this.text = text};
Comment.prototype.setNick = function(nick) {this.nick = nick};

module.exports = Comment;