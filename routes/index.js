var express = require("express");
var router = express.Router();

var User = require("../models/user");
var Post = require("../models/post");

let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

router.post("/login", function (req, response, next) {
  const { username, password } = req.body;
  User.findOne(
    {
      username: username,
    },
    (err, user) => {
      {
        if (user) {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              var token = jwt.sign(
                { id: user._id },
                process.env.SESSION_SECRET,
                {
                  expiresIn: 3600, // expires in 1 hour
                }
              );

              response.json({
                auth: true,
                message: "auth succesfull",
                token: token,
              });
            } else {
              response
                .status(400)
                .json({ auth: false, message: "wrong password" });
            }
          });
        } else
          response
            .status(400)
            .json({ auth: false, message: "user does not exist" });
      }
    }
  );
});

router.get("/protected", function (req, res) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.SESSION_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });

    res.status(200).json({
      auth: true,
      message: "Token valid unitl " + new Date(decoded.exp * 1000),
    });
  });
});

router.post("/newpost", function (req, res) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.SESSION_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });

    const { username, title, content } = req.body;

    User.findOne({
      username: username,
    }).then((user) => {
      if (!user)
        return res
          .status(500)
          .json({ auth: false, message: "Failed to authenticate token." });

      var newPost = Post({
        createdBy: user._id,
        timestamp: new Date(Date.now()),
        title: title,
        content: content,
      });

      newPost
        .save()
        .then(() =>
          res.json({ auth: true, message: "Post " + title + " added." })
        )
        .catch((err) => res.status(400).json("Error: " + err));
    });
  });
});

module.exports = router;
