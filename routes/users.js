var express = require('express');
var router = express.Router();

let User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.route('/add').post((req, res) => {
  const _username = req.body.username;
  const _password = req.body.password;
  const _joinDate = new Date(Date.now());

  User.find({
    username: _username,
  })
    .limit(1)
    .countDocuments()
    .then((countResult) => {
      if (countResult == 0) {
        console.log('create user');
        const newUser = new User({
          username: _username,
          password: _password,
          joinDate: _joinDate,
        });

        newUser
          .save()
          .then(() => res.json('User added!'))
          .catch((err) => res.status(400).json('Error: ' + err));
      } else {
        console.log('user exists');
        res.status(400).json('Error: user already exists');
      }
    });
});

module.exports = router;
