var express = require('express');
var router = express.Router();

var User = require('../models/user');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

router.post('/login', function (req, response, next) {
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
                message: 'auth succesfull',
                token: token,
              });
            } else {
              response
                .status(400)
                .json({ auth: false, message: 'wrong password' });
            }
          });
        } else
          response
            .status(400)
            .json({ auth: false, message: 'user does not exist' });
      }
    }
  );
});

router.get('/protected', function (req, res) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SESSION_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });

    res.status(200).json({
      auth: true,
      message: 'Token valid unitl ' + new Date(decoded.exp * 1000),
    });
  });
});

module.exports = router;
