let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
  timestamp: { type: Date, required: true },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
});

commentSchema.virtual('url').get(function () {
  return '/post/' + this.post + '/comment/' + this._id;
});

module.exports = mongoose.model('comment', commentSchema);
