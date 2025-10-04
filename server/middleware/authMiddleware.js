const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req,res,next)=>{
  let token
  console.log(`7: process.env.JWT_SECRET= ${process.env.JWT_SECRET}`)
  console.log(`8: req.headers.authorization= ${req.headers.authorization}`)
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
      console.log(`9: token= ${token}`)

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log(`10: decoded= ${JSON.stringify(decoded,null,4)}`)
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error.stack)
      res.status(401)
      throw new Error('21: Not Authorized')
    }
  }

  if(!token){
    console.log(error)
      res.status(401)
      throw new Error('28: Not Authorized')
  }

})

module.exports = {protect}

/* add department
db.departments.update({id:'DATACARE'},{$push: {"members":
{
"username":"sam.yamini@peerlinkmedical.com",
"name":"Sam Yamini"
}
}})
*/

//db.departments.update({id:'DATACARE'},{$pull: {"members":{"username":"dominique@peerlinkmedical.com"}}})