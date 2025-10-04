const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  username: {
    type: String,
    required: [true, 'Please add an username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  company: {
    type: String,
    required:true,
    //required: [true, 'Please add a password']
    default:''
  },
  department: {
    type: String,
    required:true,
    //required: [true, 'Please add a password']
    default:''
  },
  
  /*
  department: {
    type: String,
    
    required: [true, 'Please select a department'],
    enum: ['IT','Dev','Admin','FL','SL','Billing','HR','CEO']
  },
  */
  isAdmin: {
    type: Boolean,
    required:true,
    default: false
  },
  isActive: {
    type: Boolean,
    required:true,
    default: false
  },
  emailNotification: {
    type: Boolean,
    required:true,
    default: true
  },
  status: {
    type: String,
    required:String,
    default: 'APPROVAL',
    enum: ['APPROVAL','ACTIVE','SUSPENDED','DELETED']
  }
}, {
  timestamps : true
})

module.exports = mongoose.model('User', userSchema)