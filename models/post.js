let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, required: true },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
});

postSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

module.exports = mongoose.model('post', postSchema);
