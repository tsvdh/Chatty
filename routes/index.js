var express = require('express');
var router = express.Router();

router.get("/chat", function(req, res) {
  res.sendFile("chat.html", {root: "./public"});
});

module.exports = router;
