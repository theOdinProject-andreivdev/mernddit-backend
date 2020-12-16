var express = require('express');
var router = express.Router();

var User = require('../models/user');
let bcrypt = require('bcrypt');

router.post('/login', function (req, response, next) {
  const { username, password } = req.body;
  User.findOne(
    {
      username: username,
    },
    (err, user) => {
      {
        console.log(user);
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            response.json('auth succesfull');
          } else {
            response.status(400).json('wrong password');
          }
        });
      }
    }
  );
});

module.exports = router;
