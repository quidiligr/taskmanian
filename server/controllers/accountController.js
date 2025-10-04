const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
//const Tickets = require('../models/ticketModel')
const bcrypt = require('bcryptjs')
const config = require('../config/config')

const monk = require('monk');
const db = monk(config.kMongoDb)
const usersTable = db.get('users')
const departmentsTable = db.get('departments')
const invitesTable = db.get('invites')
const regsTable = db.get('regs')

const EmailService = require('../services/email.service')

const {v4:uuid} = require('uuid')

//const departmentsTable = db.get('departments')
/*

*/
/*
const passwordResetStart = asyncHandler(async (req,res)=>{
  
  if(!req.user.id){
    res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }
  
  const oldpassword = await regsTable.findOne({email:user.email})
  if(oldpassword &&  oldpassword.password){
    oldpassword = oldpassword.password
  }
  else{
    oldpassword = ''
  }
  
  res.status(201).json({oldpassword:oldpassword})
  
})
*/

async function getAccount(user){
  /*
  const oldpassword = await regsTable.findOne({email:user.email})
  if(oldpassword &&  oldpassword.password){
    oldpassword = oldpassword.password
  }
  else{
    oldpassword = ''
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


  const account = {email:user.email,name:user.name,departments:departments}
  return account  

}

const getMyAccount = asyncHandler(async (req,res)=>{
  
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

/*
const updateMyAccount = asyncHandler(async (req,res)=>{
  console.log('108: START: updateMyAccount()')
  
  try{
    if(!req.user.id){
      res.status(400)
      throw new Error('User not found')
    }
  
  
    const user = await User.findById(req.user.id)
  
    if(!user){
      res.status(400)
      throw new Error('User not found')
    }
    
    const {newpassword,newname} = req.body
  
    let qry_set = {}
    
    let newhash = null
    
    // validation
    if(newpassword){
      if(newpassword.length < 6){
        res.status(400)
        throw new Error('Minimum 6 alphanumeric characters required.')
      }
      else{
        // Hash Password
        const salt = await bcrypt.genSalt(10)
        newhash = await bcrypt.hash(password, salt)
        qry_set[password] = newhash
        
      }
    } 
  
    if(newname){
      
      qry_set['name'] = newname
    
      
    } 
  
    if(Object.keys(qry_set).length > 0){
        await usersTable.update({email:user.email},{$set:qry_set})
  
        qry_set = {}
        if(newname){
          qry_set['name'] = newname
        }
        if(newpassword){
          qry_set['password'] = newpassword
          qry_set['hashedPass'] = newhash
        }
  
        
        await regsTable.update({email: user.email},{$set:qry_set})
    }
  
    const account = await getAccount(user)
    console.log('169: Done: updateMyAccount()')
    
    
    res.status(201).json(account)

  }
  catch(ex){
    console.log(`176: updateMyAccount ex= ${ex.stack}`)
    res.status(400)
    throw new Error(ex.message)
    
  }
  
  
  
})
*/
/*
const passwordReset = asyncHandler(async (req,res)=>{
  
  if(!req.user.id){
    res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }
  
  const {newpassword} = req.body

  
  // validation
  if(!newpassword || newpassword.length < 6){
    res.status(400)
    throw new Error('Minimum 6 alphanumeric characters required.')
  }

  const password = newpassword

  
  // Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)

  
  
  await regsTable.update( {
    //name:name,
    email: email,
    password:password,
    hashedPass: hashedPass
  })

  await usersTable.update({email:user.email},{$set:{password:hashedPass}})

  
  res.status(201).json({done:true})
  
})
*/
// @desc Get iser tickets
// @route GET /api/tickets
// @access Private
const getInvites = asyncHandler(async (req,res)=>{
  // get user using id and token
  //console.log(`30: req.user= ${JSON.stringify(req.user,null,4)}`)
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }
  if(!user.isAdmin){
    res.status(400)
    throw new Error('Access denied')
  }

  //ROM: replaced
  //  const user = await usersTable.findOne({id:req.user.id})

  const invites = await invitesTable.find({}) //Tickets.find({$or:[{user:req.user.id},{department:user.department}]})

  //console.log(`33: getDepartments() departments= ${JSON.stringify(departments,null,4)}`)

  res.status(200).json(invites)
})



// @desc Get iser tickets
// @route GET /api/tickets/:id
// @access Private

/*
const getTicket = asyncHandler(async (req,res)=>{
  // get user using id and token
  const user = await User.findById(req.user.id)
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }

  const ticket = await Tickets.findById(req.params.id)

  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    
  }

  let members = []
  const departments = await departmentsTable.findOne({'id':ticket.department})
  if(departments && departments.members && departments.members.length > 0 ){
    members = departments.members
        
  }

  res.status(200).json({ticket:ticket,members:members})
})
*/
// @desc Create a new ticket
// @route POST /api/tickets
// @access Private

/*
const createTicket2 = asyncHandler(async (req,res)=>{
  const {product, description, department,solution} = req.body
  console.log(`53: req.body= ${JSON.stringify(req.body,null,4)}`)

  console.log(`55: product: ${product},description: ${description},department: ${department},solution: ${solution}`)


  if(!product || !description || !department){
    res.status(400)
    throw new Error('Please add product name and description')
  }

  // get user using id and token
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  console.log('68: createTicket()')
  const ticket = await Tickets.create({
    department,
    product,
    description,
    solution,
    user: req.user.id,
    status: 'new'
  })

  console.log('78: createTicket()')

  let members = []
  const departments = await departmentsTable.findOne({'id':ticket.department})
  if(departments && departments.members && departments.members.length > 0 ){
    members = departments.members
        
  }

  res.status(200).json({ticket:ticket,members:members})

  res.status(201).json(ticket)
})
*/
// @desc Delete user tickets
// @route DELETE /api/tickets/:id
// @access Private
const deleteInvite = asyncHandler(async (req,res)=>{
  // get user using id and token
  
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }
  

  const user = await User.findById(req.user.id)
  //if(!req.user){
  if(!user ){
    res.status(400)
    throw new Error('User not found')
  }

  if( !user.isAdmin ){
    res.status(400)
    throw new Error('Access denied.')
  }

  

  



  //const department = await Tickets.findById(req.params.id)
  
  const d = await invitesTable.findOne({id:req.params.id})

  if(!d){
    res.status(404)
    throw new Error('Department not found')
  }

  /*
  if(d.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('Not authorized')
  }
  */

  //await ticket.deleteOne({id: ticket.id})
  await invitesTable.remove({id:req.params.id})
  res.status(200).json({success: 'true'})
})




// @desc Update user tickets
// @route PUT /api/tickets/:id
// @access Private
const sendInvite = asyncHandler(async (req,res)=>{
  // get user using id and token
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }


  const user = await User.findById(req.user.id)
  
  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  if(!user.isAdmin){
    res.status(400)
    throw new Error('User not admin')
  }

  console.log(`req.body= ${JSON.stringify(req.body,null,4)}`)
  
  const {department,contactemail,contactname} = req.body

  const email = contactemail
  const name = contactname
  console.log(`230: department= ${department},email= ${email},name= ${name}`)

  if(department && email && name){



  }
  else{
    console.log('230: department, email, name required!')
    res.status(400)
    
    throw new Error('department, email, name required!')
  }



  let dept = await departmentsTable.findOne({id:department})

  
  if(dept && dept.id){

  }
  else{
    console.log('251: Invalid department!')
    res.status(400)
    throw new Error('Invalid department!')
  }

  // create user if needed
  const existing_user = await usersTable.findOne({email:email})

  if(!existing_user){
    let password = uuid()
    password = password.remove('-')
    password = password.substring(0,8)
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    await usersTable.insert({
      name : name,
      email : email,
      password : hashedPass,
      isAdmin : true,
      createdAt : new Date(),
      updatedAt : new Date(),
      __v : 0,
      isActive : true
    })
    
    await regsTable.insert( {
      name:name,
      email: email,
      password:password,
      hashedPass: hashedPass
    })

    //set dept if needed
    const userdepts = await departmentsTable.aggregate(
      [
        {$unwind:"$members"},
        {$match:{"members.username":user.email}},
        
        {$project:{'members.username':1}}
      ]
    )
    if (userdepts && userdepts.length > 0){
     //no update 
    }
    else{

    }



    
  }

  //delete old invites 24 hour
  console.log('258:')
  
  await invitesTable.remove ( { createdAt : {"$lt" : new Date(Date.now() - 1*24*60*60 * 1000) } })
  
  console.log('262:')
  
  
  let invite = await invitesTable.find({email:email},{$sort:{createdAt: -1}})
  
  console.log('267:')
  if(invite && invite.length > 0){
    console.log('269:')
    invite = invite[0]

  }

  else{
    console.log('275:')
    invite = {
      id: uuid(),
      email: email,
      name: name,
      createdAt: new Date()
    }
     await invitesTable.insert(invite)

     console.log('284:')

  } 

  
  console.log('289:')

  let firstname = ''
  
  if(name){
    firstname= name.split(' ')
    firstname = firstname[0]
  }
    let subject = `Invitation to Join Taskmanian`
    let body = `<p>Hi ${firstname},</p><p>We invite you to join Taskmanian, where you can easily access assistance, resources, and updates tailored to your needs.</p>
                                        
    <p><a href="https://support.peerxc.com/login/${invite.id}">Click here to join</a></p>
    
    <br>
    <br>
    
    <p>Thank you,</p>
    Support Team
    `
  


  let email_info = {
    
    from:'support@peerxc.com',
    to: email,
    subject: subject,
    //body:`Dear Dr. X
    body: body

}
/*
  for(m of members){
    if(m.members.username == 'rquidilig@peerlinkmedical.com'){
      email.to = m.members.username
      await EmailService.send2(email)
    }
  }
  */
  console.log(`323: Send invite to ${email}...`)
  await EmailService.send2(email_info)

  
  // Tickets.findByIdAndUpdate(req.params.id, req.body,{new:true})

  console.log(`329: Send invite to ${email} success!!!`)

  res.status(200).json({message:'Sent'})
})


module.exports = {
  getMyAccount,
  updateMyAccount,
  //passwordReset,
  //passwordResetStart,
  sendInvite,

 // getInvites,
  //getInvite,
  //loginInvite,
  //deleteInvite
  
}
/*
db.departments.insert({
  id:'IT',name:'IT',
  members:[
    {username:'it@peerlinkmedical.com',name:''},
    {username:'rquidilig@peerlinkmedical.com',name:'Rom The Great'},
    {username:'ray@peerlinkmedical.com',name:'Ray Zuniga'},
    {username:'ceo@peerlinkmedical.com',name:'Robert Gold'},
    {username:'dchoquette@PeerLinkMedical123.onmicrosoft.com',name:'Dominique Choquettedb.departmens'}
    
  ],
  products:[
    {id:'EK Import',name:'EK Import'},
    {id:'EK Post',name:'EK Post'},
    {id:'CID Import',name:'CID Import'},
    {id:'CID Post',name:'CID Post'},
    {id:'IME',name:'IME'},
    {id:'API',name:'API'},
    {id:'Email',name:'Email'},
    {id:'Phone',name:'Phone/PBX'},
    {id:'Computer',name:'Desktop,Laptop'},
    {id:'FileMaker',name:'FileMaker'},
    {id:'MirrorSync',name:'MirrorSync'},
    {id:'Support Portal',name:'Support Portal'},
    {id:'General',name:'General'},
  ]
})
*/