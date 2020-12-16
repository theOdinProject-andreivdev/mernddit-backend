#! /usr/bin/env node

require('dotenv').config();
var async = require('async');
var User = require('./models/user');
var Post = require('./models/post');
var Comment = require('./models/comment');

var mongoose = require('mongoose');
var mongoDB = process.env.DB_CONNECTION;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var posts = [];
var comments = [];

function userCreate(username, password, joinDate, cb) {
  userDetail = { username: username, password: password, joinDate: joinDate };

  var user = new User(userDetail);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}
function postCreate(createdBy, timestamp, title, content, cb) {
  postDetail = {
    createdBy: createdBy,
    timestamp: timestamp,
    title: title,
    content: content,
  };

  var post = new Post(postDetail);
  post.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New post: ' + post);
    posts.push(post);
    cb(null, post);
  });
}

function commentCreate(createdBy, post, timestamp, content, cb) {
  commentDetail = {
    createdBy: createdBy,
    post: post,
    timestamp: timestamp,
    content: content,
  };

  var comment = new Comment(commentDetail);
  comment.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New comment: ' + comment);
    comments.push(comment);
    cb(null, comment);
  });
}

function createUsers(cb) {
  async.series(
    [
      function (callback) {
        userCreate('somebody', 'somepass', '2012-12-12', callback);
      },
      function (callback) {
        userCreate('somebodyelse', 'someotherpass', '2020-12-12', callback);
      },
    ],
    cb
  );
}

function createPosts(cb) {
  async.parallel(
    [
      function (callback) {
        postCreate(
          users[0],
          '2015-01-01',
          'Some Title',
          'some content in this post',
          callback
        );
      },
      function (callback) {
        postCreate(
          users[0],
          '2015-01-02',
          'Some other Title',
          'some other content in this post',
          callback
        );
      },
      function (callback) {
        postCreate(
          users[1],
          '2015-02-02',
          'Some other guy Title',
          'some other guy content in this post',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createComments(cb) {
  async.parallel(
    [
      function (callback) {
        commentCreate(
          users[0],
          posts[0],
          '2020-01-01',
          'this is a comment',
          callback
        );
      },
      function (callback) {
        commentCreate(
          users[1],
          posts[0],
          '2020-01-01',
          'this is another comment',
          callback
        );
      },
      function (callback) {
        commentCreate(
          users[0],
          posts[0],
          '2020-01-01',
          'this is a third comment',
          callback
        );
      },
      function (callback) {
        commentCreate(
          users[1],
          posts[1],
          '2020-01-01',
          'this is a comment on another post',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers, createPosts, createComments],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('users:' + users);
      console.log('posts: ' + posts);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
