const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statuses = [
  'pending', 'ongoing', 'completed'
]

const TicketSchema = new Schema({
  created_by :{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responded_by :{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'pending',
    enum: statuses
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, {
  timestamps: true
})

const Ticket = mongoose.model('Ticket', TicketSchema)

module.exports = Ticket;
