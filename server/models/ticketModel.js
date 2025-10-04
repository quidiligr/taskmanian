const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  /*
  product: {
    type: String,
    required: [true, 'Please select a product'],
    enum: ['Mobile', 'Laptop', 'Tablet', 'PC']
  },
  */
  department: {
    type: String,
    required: [true, 'Please select a department'],
    enum: ['IT','Dev','Admin','FL','SL','Billing','HR']
  },
  assignto: {
    type: String,
    //required: true,
    //required: [true, 'Please select a department'],
    //enum: ['IT','Dev','Admin','FL','SL','Billing','HR']
    default:''
  },
  openby: {
    type: String,
    //required: true, // [true, 'Please select a department'],
    default: ''
  },
  product: {
    type: String,
    required: [true, 'Please select a product'],
    enum: ['EK Import','EK Post','CID Import','CID Post','IME','API','Email','Phone','Computer', 'FileMaker','MirrorSync','General']
  },
  description: {
    type: String,
    required: [true, 'Please enter a description of the issue']
  },
  solution: {
    type: String,
    //required: [true, 'Please enter the solution of the issue']
    default:''
  },
  status: {
    type: String,
    required:true,
    enum:['new', 'open', 'closed'],
    default: 'new'
  }
}, {
  timestamps : true
})

module.exports = mongoose.model('Tickets', ticketSchema)