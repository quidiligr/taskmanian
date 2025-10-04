const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const monk = require('monk');
const db = monk(config.kMongoDb)
const usersTable = db.get('users')
const regsTable = db.get('regs')
const tokensTable = db.get('tokens')
const User = require('../models/userModel')

const generateToken = (id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc Register a new user
// @route /api/users
// @access Public
//const registerUser = asyncHandler(async (req,res)=>{
//exports.registerUser = asyncHandler(async (name,email,password,company,department,isAdmin)=>{
  exports.registerUser = async (registerInfo) => {
  //exports.createAccount = async (username,password,fullName,email,roleId,status,root_path) =>{
    //const {name,email,password} = req.body
    //const {name,email,password,company,department} = req.body
  
    // validation
   // let {name,email,username,password,company,department,isAdmin} = registerInfo
    console.log(`registerInfo= ${JSON.stringify(registerInfo,null,4)}`)
    if(registerInfo.name && registerInfo.email && registerInfo.username && registerInfo.password 
      && registerInfo.company != null && registerInfo.department != null){
     
  
        registerInfo.name = registerInfo.name.trim()
        registerInfo.email = registerInfo.email.trim()
        registerInfo.username = registerInfo.username.trim()
    // Find if user exists
    //const userExists = await User.findOne({email})
    const userExists = await usersTable.find({$or:[{email:registerInfo.email},{username:registerInfo.username}]})
  
    console.log(`33: userExists= ${JSON.stringify(userExists,null,4)}`)

    if(userExists && userExists.length > 0){
      //res.status(400)
      //throw new Error('Username or email address already exists.')
      
      return {statusCode:500,message:'Username or email address already exists.'}
    }
    

  
    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(registerInfo.password, salt)
  
    // create user
    /*
    const user = await User.create({
      username,
      password: hashedPass,
      email,
      isAdmin:isAdmin,
      name,
      company,
      department,
      
      emailNotification: true,
      
    })
  */
 await usersTable.insert({
  createdAt:new Date(),
  username:registerInfo.username,
  password: hashedPass,
  email:registerInfo.email,
  isAdmin:registerInfo['isAdmin']?registerInfo.isAdmin:false,
  name:registerInfo.name,
  company:registerInfo.company,
  department:registerInfo.department,
  
  emailNotification: true,
  
}) 
    
    //ROM:
    const new_user = await  usersTable.findOne({username:registerInfo.username})
    new_user['id'] = new_user._id.toString()
    await usersTable.update({username:new_user.username},{$set:{id:new_user.id}})

    await regsTable.remove({username: new_user.username})

  
    await regsTable.insert( {
      username: new_user.username,
      email: new_user.email,
      password: new_user.password,
      hashedPass: new_user.hashedPass,
      name: new_user.name,
      company: new_user.company,
      department: new_user.department,
      
    })
  
    //if(new_user){
      //res.status(201).json({
      return {statusCode: 200, data:{
        _id: new_user._id,
        name:new_user.name,
        email: new_user.email,
        company: new_user.company,
        department: new_user.department,
        isAdmin: new_user.isAdmin,
        enableEmailNotification: new_user.enableEmailNotification,
        token: generateToken(new_user._id)
      }}
    /*}else{
      res.status(400)
      throw new Error('Invalid user data')
    }
      */
    }
   else {
    
    //throw new Error('Please enter required fields')
    return {statusCode:500,message:'Please enter required fields'}
  }
  
  }
  
/*
exports.createAccount = async (username,password,fullName,email,roleId,status,root_path) =>{
    let existing = await accountTable.findOne({username:username})
    if(existing && existing.username){
        console.log(`username ${username} exisits!`)
    }
    else{
       
        const hash =bcrypt.hashSync(password,13)
        if(hash && hash.length>0){
            await accountTable.insert({
                username:username,
                password:hash,
                fullName:fullName,
                email:email,
                roleId:roleId,
                status:status,
                root_path:root_path})
            console.log('Success!')
            
        }
        else{
            console.log(`hash error!`)
        }
    }

    
} 
*/
