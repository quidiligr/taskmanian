const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default:''
  },
  members: {
    type: String,
    required: [true, 'Please add a email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  department: {
    type: String,
    
    required: [true, 'Please select a department'],
    enum: ['IT','Dev','Admin','FL','SL','Billing','HR','CEO']
  },
  isAdmin: {
    type: Boolean,
    required:true,
    default: false
  }
}, {
  timestamps : true
})

module.exports = mongoose.model('Department', departmentSchema)