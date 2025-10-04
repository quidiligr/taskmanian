const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
//const Tickets = require('../models/ticketModel')

const config = require('../config/config')

const monk = require('monk');
const db = monk(config.kMongoDb)
const usersTable = db.get('users')
const departmentsTable = db.get('departments')
const invitesTable = db.get('invites')

const {v4:uuid} = require('uuid')

//const departmentsTable = db.get('departments')

// @desc Get iser tickets
// @route GET /api/tickets
// @access Private
const getDepartments = asyncHandler(async (req,res)=>{
  // get user using id and token
  //console.log(`30: req.user= ${JSON.stringify(req.user,null,4)}`)
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  //ROM: replaced
  //  const user = await usersTable.findOne({id:req.user.id})
 // const departments = await departmentsTable.find({}) //Tickets.find({$or:[{user:req.user.id},{department:user.department}]})

  const departments = await departmentsTable.aggregate(
  [
    {$sort:{priority:-1,name:1}}
  ]
    )
  /*
  db.departments.insert({
  
    "id" : "",
    "name" : "",
    "members" : [ ],
    "products" : [ ],
    "company" : "PEERLINK",
    "department" : ""
})

{ "_id" : ObjectId("66e88622bd87730ec9112311"), "id" : "PEERLINK/IT" }
{ "_id" : ObjectId("66f26e8595a4244fe0ea3a8e"), "id" : "PEERLINK/DEV" }
{ "_id" : ObjectId("66f26eb895a4244fe0ea3a8f"), "id" : "PEERLINK/ADMIN" }
{ "_id" : ObjectId("66f26f4295a4244fe0ea3a90"), "id" : "PEERLINK/HR" }
{
        "_id" : ObjectId("66f26f6f95a4244fe0ea3a91"),
        "id" : "PEERLINK/CUSTOMERSERVICE"
}
{ "_id" : ObjectId("66f26f9d95a4244fe0ea3a92"), "id" : "PEERLINK/CUSTOMER" }
{ "_id" : ObjectId("670400b2ceb22406b24e39ff"), "id" : "PEERLINK/QA" }
{ "_id" : ObjectId("6704e3d1b8934809c5cdbe3a"), "id" : "PEERLINK/DATACARE" }
{ "_id" : ObjectId("67058bfa95a4244fe0ea3a96"), "id" : "" }

db.departments.update({id:'PEERLINK/CUSTOMERSERVICE'},{$set:{
  id:'CUSTOMERSERVICE',
  name:'CUSTOMERSERVICE',
  department:'CUSTOMERSERVICE'}})
  
  */
 /*
db.departments.update({id:'DATACARE'},{$set:{members:

  [
    {
            "username" : "ekapi@peerlinkmedical.com",
            "name" : ""
    },
    {
            "username" : "rquidilig@peerlinkmedical.com",
            "name" : "Rom The Great"
    },
    {
            "username" : "bsieben@datacare.com",
            "name" : "Ben Sieben",
            "company" : "DATACARE"
    },
    {
            "username" : "ray@peerlinkmedical.com",
            "name" : "Ray Zuniga"
    },
    {
            "username" : "ceo@peerlinkmedical.com",
            "name" : "Robert Gold"
    },
    {
            "username" : "dominique@peerlinkmedical.com",
            "name" : "Dominique Choquette"
    },
    
    {
            "username" : "rquidilig@gmail.com",
            "name" : "Rom"
    },
    
    {
            "username" : "dgaputin@datacare.com",
            "name" : "Dmitry Gaputin",
            "company" : "DATACARE"
    }
    
    
    
]
}})
*/
/*
db.departments.update({id:'PEERLINK/DATACARE'},{$set:{products:[
  {
  "id" : "API",
  "name" : "API"
  }]}}) 

  db.departments.update({id:'PEERLINK/DATACARE'},{$set:{
    id:'PEERLINK/DATACARE',
    name:'PEERLINK/DATACARE',
    company: 'PEERLINK',
    department:'PEERLINK/DATACARE'}})
    
    
*/

  //set default department if needed for specific user
  //f(user.company !== config.kCompany){

 // }
  
  //console.log(`33: getDepartments() departments= ${JSON.stringify(departments,null,4)}`)


  res.status(200).json(departments)
})



// @desc Get iser tickets
// @route GET /api/tickets/:id
// @access Private
const getDepartment = asyncHandler(async (req,res)=>{
  // get user using id and token
  const user = await User.findById(req.user.id)
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }

  //ROM replaced: const ticket = await Tickets.findById(req.params.id)
  const department = await departmentsTable.findOne({id:req.params.id}) //Tickets.findById(req.params.id)
  //const ticket = await Tickets.findOne({id:req.params.id})

  if(!department){
    res.status(404)
    throw new Error('Ticket not found')
  }
/*
  if(department.user.toString() !== req.user.id){
    res.status(401)
    
  }
*/
  res.status(200).json(department)
})
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
const createDepartment = asyncHandler(async (req,res)=>{
  //const {product, description, department,solution} = req.body

  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }

  // get user using id and token
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  if(!user.isAdmin){
    res.status(400)
    throw new Error('User not admin')
  }


  const {id, name} = req.body
  console.log(`53: req.body= ${JSON.stringify(req.body,null,4)}`)

  //console.log(`55: product: ${product},description: ${description},department: ${department},solution: ${solution}`)


  const info = {id:id,name:'',company:''}
  

  if(id && name){
    console.log('68: createDepartment() input OK()')
    
  }
  else{
    res.status(400)
    throw new Error('Please add product name and description')
  }

  
  //console.log('68: createTicket()')
  /*
  const ticket = await Tickets.create({
    department,
    product,
    description,
    solution,
    user: req.user.id,
    status: 'new'
  })
  */
 let existing = await departmentsTable.findOne({id:id})
 if(existing && existing.id){
     console.log(`department ${existing.id} exists!`)
     res.status(201).json(existing)
}

 await departmentsTable.insert({
    id:id,
    name: name,
    members:[],
    products:[]
  })


  const department = await departmentsTable.findOne({id:id})
 

  //console.log('78: createDepartment()')

  res.status(201).json(department)
})

/*
db.departments.update({id:'DATACARE'},{$set:{members:
[
{
"username" : "ekapi@peerlinkmedical.com",
"name" : ""
},
{
"username" : "rquidilig@peerlinkmedical.com",
"name" : "Rom The Great"
},
{
"username" : "bsieben@datacare.com",
"name" : "Ben Sieben",
"company" : "DATACARE"
},
{
"username" : "ray@peerlinkmedical.com",
"name" : "Ray Zuniga"
},
{
"username" : "ceo@peerlinkmedical.com",
"name" : "Robert Gold"
},
{
"username" : "dominique@peerlinkmedical.com",
"name" : "Dominique Choquette"
},
{
"username" : "sam.yamini@peerlinkmedical.com",
"name" : "Robert Gold"
},
]
}})
*/

//db.departments.updateMany({},{$set:{priority:0}})
//db.departments.update({id:''},{$set:{priority:10}})
/*
db.departments.update(
{ "id": "IT" },
{ 
"$push": {
"products": {
"id" : "NFS",
"name" : "NFS"
}
}
}
)
*/
/*
db.departments.update({id:'Admin'},{$set:{members:[
  {
  "username" : "admin@peerlinkmedical.com",
  "name" : ""
  },
  {
  "username" : "darin@peerlinkmedical.com",
  "name" : "Darin Jones"
  },
  ]}})

db.departments.update({id:'Dev'},{$set:{members:[
{
"username" : "dev@peerlinkmedical.com",
"name" : ""
},
{
"username" : "rquidilig@peerlinkmedical.com",
"name" : "Rom The Great"
},
]}})
  */
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
const deleteDepartment = asyncHandler(async (req,res)=>{
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
    throw new Error('User not admin')
  }

  

  



  //const department = await Tickets.findById(req.params.id)
  
  const d = await departmentsTable.findOne({id:req.params.id})

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
  await departmentsTable.remove({id:req.params.id})
  res.status(200).json({success: 'true'})
})

// @desc Update user tickets
// @route PUT /api/tickets/:id
// @access Private
const updateDepartment = asyncHandler(async (req,res)=>{
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


  //const ticket = await Tickets.findById(req.params.id)
  const d = await departmentsTable.findOne({id:req.params.id})

  if(!d){
    res.status(404)
    throw new Error('Department not found')
  }

  /*
  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('125: Not authorized')
  }
  */

  const updatedDepartment = await departmentsTable.update({id:id},{$set:{name:req.body.name}}) // Tickets.findByIdAndUpdate(req.params.id, req.body,{new:true})

  res.status(200).json(updatedDepartment)
})

// @desc Update user tickets
// @route PUT /api/tickets/:id
// @access Private
const createInvite = asyncHandler(async (req,res)=>{
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

  
  
  const {department,email} = req.body

  if(department && email){

  }
  else{
    res.status(400)
    throw new Error('Invalid input email or department!')
  }


  let dept = await departmentsTable.find({id:department})

  
  if(dept && dept.id){

  }
  else{
    res.status(400)
    throw new Error('Invalid department!')
  }

  //delete old invites 24 hour
  
  await invitesTable ( { createdAt : {"$lt" : new Date(Date.now() - 1*24*60*60 * 1000) } })
  
  
  let invite = await invitesTable.find({email:email},{$sort:{createdAt: -1}})
  
  if(invite && invite.length > 0){
    invite = invite[0]

  }

  else{

    invite = {
      id: uuid(),
      email: email,
      createdAt: new Date()
    }
     await invitesTable.insert(invite)

  } 

  

  
    let subject = `Invitation to Join the Taskmanian`
    let body = `<p>We invite you to join the Taskmanian, where you can easily access assistance, resources, and updates tailored to your needs.</p>
                                        
    <p><a href="https://taskmanian.com/join/${invite.id}">Click here to join</a></p>
    
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
  await EmailService.send2(email_info)

  
  // Tickets.findByIdAndUpdate(req.params.id, req.body,{new:true})

  res.status(200).json({message:'Sent'})
})


module.exports = {
  createDepartment,
  createInvite,
  getDepartments,
  getDepartment,
  deleteDepartment,
  updateDepartment,
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
/*
db.departments.insert(
{
"id" : "IT",
"name" : "IT",
"members" : [
{
"username" : "it@physicianreviewservices.com",
"name" : ""
},
{
"username" : "rquidilig@gmail.com",
"name" : "Rom The Great"
},
{
"username" : "sam@physicianreviewservices.com",
"name" : "Sam Yamini"
}
],
"products" : [
{
"id" : "EK",
"name" : "EK"
},
{
"id" : "Medex",
"name" : "Medex"
},
{
"id" : "Arissa",
"name" : "Arissa"
},
{
"id" : "API",
"name" : "API"
},
{
"id" : "Email",
"name" : "Email"
},
{
"id" : "Phone",
"name" : "Phone/PBX"
},
{
"id" : "Computer",
"name" : "Desktop,Laptop"
},
{
"id" : "Support Portal",
"name" : "Support Portal"
},
{
"id" : "General",
"name" : "General"
}
],
"company" : "PRS",
"department" : "IT",
"priority" : 9
})
*/

//db.department.update({id:'IT'},{$push:{products:{id:'PRS Software',name:'PRS Software'}}})
/*
db.departments.update({id:'IT'},{$set:{products:[
{
"id" : "",
"name" : ""
},
{
"id" : "EK",
"name" : "EK"
},
{
"id" : "Medex",
"name" : "Medex"
},
{
"id" : "Arissa",
"name" : "Arissa"
},
{
"id" : "API",
"name" : "API"
},
{
"id" : "Email",
"name" : "Email"
},
{
"id" : "Phone",
"name" : "Phone/PBX"
},
{
"id" : "Computer",
"name" : "Desktop,Laptop"
},
{
"id" : "Support Portal",
"name" : "Support Portal"
},
{
"id" : "General",
"name" : "General"
},
{
"id" : "PRS Software",
"name" : "PRS Software"
}
]}})
*/