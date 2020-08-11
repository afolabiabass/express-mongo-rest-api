const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  ticket_id :{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  user_id :{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment;
