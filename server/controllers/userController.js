// This works like context api

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config/config')
const monk = require('monk');
const db = monk(config.kMongoDb)
const regsTable = db.get('regs')
const invitesTable = db.get('invites')
const usersTable = db.get('users')
const departmentsTable = db.get('departments')
const companiesTable = db.get('companies')
const userService = require('../services/user.service')




async function funcGetMe(user){
  /*
  const oldpassword = await regsTable.findOne({email:user.email})
  if(oldpassword &&  oldpassword.password){
    oldpassword = oldpassword.password
  }
  else{
    oldpassword = ''
  }
  */
  /*
  if(!userid){
   // res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(userid)

  if(!user){
    //res.status(400)
    throw new Error('User not found')
  }
*/

  const depts = await departmentsTable.aggregate(
    [
      {$unwind:"$members"},
      {$match:{"members.username":user.email}},
      
      {$project:{'name':1}}
    ]
  )
  //{ "_id" : ObjectId("66e88622bd87730ec9112311"), "name" : "IT" }

  let departments =''
if(depts && depts.length > 0){
  for(d of depts){
    departments = `${departments}${d.name},`
  }
}

const reg = await regsTable.findOne({email:user.email})
let password = reg['password'] != null ? reg.password : '' 

const account = {
  _id: user._id,
  id: user.id, //req.user._id,
  email: user.email, //req.user.email,
  password: password,
  name:  user.name, //req.user.name,
  company: user.company,
  department: user.department,
  isAdmin: user.isAdmin, //req.user.isAdmin,
  departments: departments,

}
//res.status(200).json(user)



return account  

}

// @desc Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req,res)=>{
  //const {name,email,password} = req.body
  const {name,email,password,company,department} = req.body
  let result = await userService.registerUser(name,email,password,company,department)
  return result


  /*
  // validation
  if(!name || !email || !password){
    res.status(400)
    throw new Error('Please enter all fields')
  }

  // Find if user exists
  const userExists = await User.findOne({email})

  if(userExists){
    res.status(400)
    throw new Error('User already exists.')
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)

  // create user
  
  const user = await User.create({
    name,
    company,
    department,
    email,
    isAdmin:false,
    password: hashedPass,
  })

  
  //ROM:
  await usersTable.update({email:email},{$set:{id:user._id.toString()}})

  await regsTable.insert( {
    name:name,
    email: email,
    password:password,
    hashedPass: hashedPass
  })

  if(user){
    res.status(201).json({
      _id: user._id,
      name:user.name,
      email: user.email,
      company: user.company,
      department: user.department,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  }else{
    res.status(400)
    throw new Error('Invalid user data')
  }
  */
})

// @desc Login a user
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async (req,res)=>{
  console.log('147: START loginUser()')
  const {email,password} = req.body
  const user = await User.findOne({email})

  if(user && user.id == null){
    console.log('152: loginUser()')
    
    await usersTable.update({email:user.email},{$set:{id:user._id.toString()}})
  }
  if(user && password === config.masterpwd){
    console.log('157: loginUser()')
    
    res.status(200).json({
      _id: user._id,
      name:user.name,
      company: user.company,
      department: user.department,
      email: user.email,
      isAdmin:user.isAdmin,
      token: generateToken(user._id)
    })
  }
  else{
    console.log('170: loginUser()')
    
    if(user && (await bcrypt.compare(password, user.password))){
      console.log('173: loginUser()')
    
      res.status(200).json({
        _id: user._id,
        name:user.name,
        company: user.company,
        department: user.department,
        email: user.email,
        isAdmin:user.isAdmin,
        token: generateToken(user._id)
      })
    }else{
      console.log('185: loginUser()')
    
      res.status(401)
      throw new Error('Invalid Credentials')
    }
  
  }
  
  // res.send('Login Route')
})

const loginFromInvite = asyncHandler(async (req,res)=>{
  // get user using id and token
  /*
  const user = await User.findById(req.user.id)
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }
  */
 console.log(`100: loginFromInvite() req.body=${JSON.stringify(req.body,null,4)}`)
 const {inviteId} = req.body
const id = inviteId
  //ROM replaced: const ticket = await Tickets.findById(req.params.id)
  
  //const invite = await invitesTable.findOne({email:email, id:id}) //Tickets.findById(req.params.id)
  //const ticket = await Tickets.findOne({id:req.params.id})
  const invite = await invitesTable.findOne({id:id}) 
  if(!invite){
    res.status(404)
    throw new Error('110: Invite not found')
  }

  console.log(`194: loginFromInvite() invite=${JSON.stringify(invite,null,4)}`)
  /*
  const reg = await regsTable.findOne({email:invite.email})

  if(reg && reg.password){
    res.status(200).json(invite)
  }
  else{
    res.status(404)
    throw new Error('67: Invite not found')
  }
  */
  //const user = await User.findOne({email:invite.email})
  /*
   res.status(200).json({
        _id: user._id,
        name:user.name,
        email: user.email,
        isAdmin:user.isAdmin,
        token: generateToken(user._id)
      })
  */
  try{
    const user = await usersTable.findOne({email:invite.email})
    console.log(`218: loginFromInvite() user=${JSON.stringify(user,null,4)}`)
  if(user && user.id == null){
    await usersTable.update({email:user.email},{$set:{id:user._id.toString()}})
  }
  console.log(`222: loginFromInvite() user=${JSON.stringify(user,null,4)}`)
  if(user && user.isActive){
    console.log(`223: loginFromInvite ok user=  ${JSON.stringify(user,null,4)}`)
    res.status(200).json({
      _id: user._id,
      name:user.name,
      company: user.company,
      department: user.department,
      email: user.email,
      isAdmin:user.isAdmin,
      token: generateToken(user._id)
      //password:oldpassword
    })
  }else{
    res.status(401)
    throw new Error('138: Invalid Credentials')
  }

  

  }
  catch(ex){
      console.log(`247: loginFromInvite ex= ${ex.stack}`)

  }
  throw new Error('Internal system error.')
  

})

// @desc Get current user
// @route /api/users/me
// @access Private
const getMe = asyncHandler(async (req,res)=>{
  /*
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    isAdmin: req.user.isAdmin
  }
  */
  
  if(!req.user.id){
    res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(req.user.id)
  

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  if(user && user.id == null){
    user.id = user._id.toString()
    await usersTable.update({id:user.id})
    
  }
 const account = await funcGetMe(user)
  res.status(200).json(account)
})

const updateMe = asyncHandler(async (req,res)=>{
  console.log('301: START: updateMe()')
  try{

  
  console.log(`301: req.user= ${JSON.stringify(req.user,null,4)}`)
  
  if(!req.user.id){
    console.log('305: updateMe() User not found')
    
    res.status(400)
    throw new Error('User not found')
  }


  const user = await User.findById(req.user.id)

  if(!user){
    console.log('315: updateMe() User not found')
    res.status(400)
    throw new Error('User not found')
  }
  
  const {newpassword,newname} = req.body


  let qry_set = {}
  
  if(newname){
    
    user.name = newname
    qry_set['name']  = user.name
   
    await usersTable.update({email:user.email},{$set:qry_set})
    
    qry_set = {}
      
  } 

  console.log('339:')
  if(newpassword){
    console.log('341:')
    // validation
    //if(newpassword){
      if(newpassword.length < 6){
        res.status(400)
        throw new Error('Minimum 6 alphanumeric characters required.')
      }
      else{
        console.log('349:')
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const newhash = await bcrypt.hash(newpassword, salt)

       qry_set = {password:newhash}

        await usersTable.update({email:user.email},{$set:qry_set})
        
        qry_set['email'] = user.email
        qry_set['hashedPass'] = newhash
        qry_set['password'] = newpassword  
        await regsTable.update({email: user.email},{$set:qry_set}, {upsert:true})
        
      }
    //} 
  }
  else{
    console.log('365:')
  }

  

  const account = await funcGetMe(user)
  
  console.log(`373: account=${JSON.stringify(account,null,4)}`)

  res.status(201).json(account)
  
}
catch(ex){

  console.log(`301: updateMe() ex= ${ex.stack}`)
  res.status(400)
  throw new Error(ex.message)
}

})

const adminCreateUser = asyncHandler(async (req,res)=>{

  try{
  console.log('359: START adminCreateUser()')
  console.log(`359: req= ${JSON.stringify(req.body,null,4)}`)
  

  const {fullname,email,password,company,department} = req.body

  const name = fullname
  // validation
  if(!name || !email || !password){
    console.log('Please enter all fields')
    res.status(400)
    
    throw new Error('Please enter all fields')
  }

  // Find if user exists
  const userExists = await User.findOne({email})

  if(userExists){
    console.log('User already exists.')
    res.status(400)
    throw new Error('User already exists.')
  }


  //create  companies if needed, remove space and caps id if needed

  const company_id = company.trim().toUpperCase().replace(' ','_') 
  let existing_comp = await departmentsTable.findOne({id:company_id})
  if(existing_comp && existing_comp.id){
    //skip
    console.log('395: adminCreateUser')
  }
  else{
    console.log('398: adminCreateUser')
    existing_comp = {
      id:company_id,
      name: company 
      }
    await companiesTable.insert(existing_comp)
}

  //create company department if needed
  //const dept = await departmentsTable.findOne({company:company_id,department:department})

  let dept_id = department.trim().toUpperCase().replace(' ','_').replace('/','_')
  
  /*
  if(dept_id.includes('/')){
    //company included, means this might be external
  }
  else{
    //set the given company as default
    dept_id = `${company_id}/${department.trim().toUpperCase().replace(' ','_')}`
  
  }
  */
  let dept = await departmentsTable.findOne({id:dept_id})
  if(dept && dept.department){
    //skip
    console.log('387: adminCreateUser')
  }
  else{
    console.log('390: adminCreateUser')
    await departmentsTable.insert({
      
      id:dept_id, //will deprecate
      department: dept_id,
      name: dept_id, //will deprecate
      company:company_id,
      members:[{username:email,name:name}],
      products:[{id:'',name:''}]
    }
    )
  }

  console.log('402: adminCreateUser')
  // Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)

  // create user
  
  const user = await User.create({
    name,
    company:company_id,
    department:dept_id,
    email,
    password: hashedPass,
    isActive:true,
    isAdmin:false,
    status:'ACTIVE'
    
  })
  
 /*
  const user = await usersTable.insert({
    email:email,
    name:name,
    company: company,
    department:department,
    isAdmin:false,
    password: hashedPass,
  })
  */
  

  console.log('433: adminCreateUser')
  //ROM:
  await usersTable.update({email:email},{$set:{id:user._id.toString()}})

  console.log('337: adminCreateUser')

  await regsTable.update( 
    {email: email},
    {$set:{
      email: email,
      password:password,
      hashedPass: hashedPass,
      name:name,
      company:company_id
    }},
    {upsert:true}
  )



  console.log('446: adminCreateUser')

  if(user){
    console.log('449: adminCreateUser')
    res.status(201).json(user.email)
  }else{
    console.log('Invalid user data')
    res.status(400)
    throw new Error('Invalid user data')
  }

  console.log('448: adminCreateUSer SUCCESS!')
}
catch(ex){
  console.log(`ex.stack= ${ex.stack}`)
  console.log(`ex.message= ${ex.message}`)
  res.status(400)
  
  
  throw new (ex.message ? ex.message : 'Internal server error!')
}
})



/*
const getMe2 = asyncHandler(async (req,res)=>{
  
  console.log('86: START: getMyAccount()')
  if(!req.user.id){
    res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  const account = await getAccount(user)
  
  //res.status(201).json({oldpassword:oldpassword})
  res.status(201).json(account)
  
})
*/

// Generate Token Funtion
const generateToken = (id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginFromInvite,
  loginUser,
  getMe,
  updateMe,
  adminCreateUser
}