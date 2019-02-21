var User = function(nick, pwd) {
    this.nickname = nick;
    this.password = pwd;
}

User.prototype.getNickname = function() {return this.nickname};
User.prototype.getPassword = function() {return this.password};
User.prototype.setNickname = function(nick) {this.nickname = nick};
User.prototype.setPassword = function(pwd) {this.password = pwd};

module.exports = User;