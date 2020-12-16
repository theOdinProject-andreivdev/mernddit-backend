let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 100 },
  joinDate: { type: Date, required: true },
});

userSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

module.exports = mongoose.model('user', userSchema);
