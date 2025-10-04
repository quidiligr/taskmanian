const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Tickets = require('../models/ticketModel')

const config = require('../config/config')

const monk = require('monk');
const db = monk(config.kMongoDb)
//const ObjectID = require('mongodb').ObjectID;
const usersTable = db.get('users')
const ticketsTable = db.get('tickets')
const idsTable =  db.get('ids')
const departmentsTable =  db.get('departments')

const EmailService = require('../services/email.service')




//const departmentsTable = db.get('departments')

// @desc Get iser tickets
// @route GET /api/tickets
// @access Private
const getTickets = asyncHandler(async (req,res)=>{
  // get user using id and token
  console.log(`30: getTickets() req.user= ${JSON.stringify(req.user,null,4)}`)
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  //ROM: replaced
  //  const user = await usersTable.findOne({id:req.user.id})

  //const tickets = await Tickets.find({$or:[{user:req.user.id},{department:user.department}]})
  //db.departments.aggregate([{$unwind:"$members"},{$match:{"members.username":'rquidilig@peerlinkmedical.com'}},{$project:{id:1,name:1}}]).pretty()

  let tickets = []

  const  arr_dept = [
    {$unwind:"$members"},
    {$match:{"members.username":user.email}},
    {$project:{id:1,name:1}}
  ] 
  console.log(`arr_dept =${JSON.stringify(arr_dept,null,4)}`)

  let d1 = await departmentsTable.aggregate(
    arr_dept
  )



  
  if(d1 && d1.length > 0){
    let d2 = []

    for(x of d1){
      d2.push(x.id)
    }
  
    if(d2.length > 0){
      console.log(`${user.email} departments= ${JSON.stringify(d2,null,4)}`)
    //tickets = await ticketsTable.find({department:{$in:d2}})
      tickets = await ticketsTable.aggregate([
        //{$match:{department:{$in:d2}}},
        {$match:{$or:[{department:{$in:d2}},{'createdby.username':user.email}]}},
        //{$sort:{createdAt:-1}}
        {$sort:{status_id:1,createdAt:-1}}
      ]
        )
    }
    else{
      console.log(`72: No department(s) for user ${user.email}`)
    }

  }
  else{
    console.log(`77: No department(s) for user ${user.email}`)
  }

/*  

db.tickets.aggregate([
{$match:{$or:[{department:{$in:['Admin']}},{'createdby.username':'darin@peerlinkmedical.com'}]}},
{$sort:{createdAt:-1}}])
*/      

  res.status(200).json(tickets)
})



// @desc Get iser tickets
// @route GET /api/tickets/:id
// @access Private
const getTicket = asyncHandler(async (req,res)=>{
  // get user using id and token
 console.log(`90: server getTicket() req=${JSON.stringify(req.params,null,4)}`)
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(req.user.id)
 
  
  
  //ROM replaced: const ticket = await Tickets.findById(req.params.id)
  //const ticket = await Tickets.findById(req.params.id)
  //const ticket = await ticketsTable.findOne({_id:ObjectID(req.params.id)}) //ickets.findOne({id:req.params.id})
  let ticket = await ticketsTable.findOne({id:req.params.id}) 
  console.log(`104: server getTicket() ticket=${JSON.stringify(ticket,null,4)}`)
  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }

  //set missing fileds if needed
  if(ticket['notes'] == null){
    ticket.notes = []
    await ticketsTable.update({id:ticket.id},{$set:{notes:[]}})
  }


  //get user depts
  
  let is_staff = false
  
  const d1 = await departmentsTable.aggregate(
    [
      {$unwind:"$members"},
      {$match:{"members.username":user.email}},
      {$project:{id:1,name:1}}
    ]
  )
/*
db.departments.aggregate(
[
{$unwind:"$members"},
{$match:{"members.username":'rquidilig@peerlinkmedical.com'}},
{$project:{id:1,name:1}}
]
)
*/
  
  if(d1 && d1.length > 0){
    
    
    for(x of d1){
      //d2.push(x.id)
      if(x.id == ticket.department){
        is_staff = true
        break
      }
    }
  
    
    
  }

  
  ticket['isstaff'] = is_staff
  


  if(ticket.department){
    console.log(`159: server getTicket()`)
  
    const depts = await departmentsTable.aggregate(
      [
        {$match:{"id":ticket.department}},
        {$unwind:"$members"},
        {$match:{"members.username":user.email}}
        
      ]
    )
    //{ "_id" : ObjectId("66e88622bd87730ec9112311"), "name" : "IT" }
  
    if(depts && depts.length > 0){
      console.log('172: Authorized')
    
    }
    
    else{
      if(ticket.createdby.username == user.email){
        console.log('178: Authorized')
      
      }
      else{
        console.log('183: Unauthorized')
        throw new Error('183: Unauthorized')
      }
      
    }
    
  }
  else{
    console.log(`177: server getTicket()`)
  }
  

 console.log(`181: server getTicket() ticket=${JSON.stringify(ticket,null,4)}`)
  
  res.status(200).json(ticket)
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
const createTicket = asyncHandler(async (req,res)=>{
  const {product, description, department,member} = req.body
  console.log(`53: createTicket req.body= ${JSON.stringify(req.body,null,4)}`)

  
 // console.log(`55: createTicket product: ${product},description: ${description},department: ${department}`)


  //if(!product || !description || !department){
  if(!description){
    res.status(400)
    throw new Error('Please add product name and description')
  }

  if(department === null){
    department = 'IT'
  }

  if(product === null){
    product = ''
  }
  
  if(member === null){
    member = ''
  }
  


  // get user using id and token
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  console.log('68: createTicket()')
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

//let newidnum = 1 
//let final_id = 1
let next_id = await idsTable.findOne({name:department})

if(next_id && next_id.value){
  next_id = next_id.value
}
else{
  next_id = 1 //seed
}

let existing_id = await ticketsTable.findOne({id_num:next_id})
if(existing_id){
  existing_id = await ticketsTable.aggregate(
    [
      { $sort : { id_num : -1 } },
      { $limit : 1 },
      
    ]
  )
  if(existing_id && existing_id.length > 0){
    next_id = existing_id[0].id_num + 1
  
  }
}

if(next_id > 0){
  
  await idsTable.update({name:department},{$set:{name:department,value:next_id + 1}},{upsert:true})
  
}
else{
  console.log(`163: createTicket Error allocating id!!!`)
  res.status(400)
    throw new Error('createTicket Error allocating id')
}

const norm_department = department.replace('/','-')
const new_id = `${norm_department}-${next_id}`

let assigntouser = null
if(member){
  assigntouser = await usersTable.findOne({email:member})
}

if(assigntouser == null){
  assigntouser = {username:'',name:''}
}
else{
  assigntouser = {username:assigntouser.email,name:assigntouser.name}
}


await ticketsTable.insert({
  id:  new_id,
  id_num: next_id, 
  department:department,
  product:product,
  description:description,
  solution:'',
  notes:[],
  user: req.user.id,
  //email: user.email,
  //name: user.name,
  createdby:{username:user.email,name:user.name},
  assignto:assigntouser,
  status: 'new',
  status_id: 0,
  createdAt: new Date()
})

const ticket = await ticketsTable.findOne({id:new_id})

  console.log('78: createTicket()')

  //notify
  try{
    const opt_emails = await usersTable.find({email_notification:false},{email:1})


    let email = {
          
      from:'noreplyt@taskmanian.com',
      to: '',
      subject: `New support ticket is assigned to ${department}`,
      //body:`Dear Dr. X
      body: `
      <p>Hi,</p>
      
      <p>Department: ${ticket.department}</p>
      <p>Product/Service: ${ticket.product}</p>
      
                                          
      <p>Ticket#: ${ticket.id}</p>
      <p>Issue: ${ticket.description}</p>
      <br>
      <br>
      
      <p>Thank you,</p>
      Support Team
      `
    }
    if(ticket['assignto'] && ticket.assignto['username'] && ticket.assignto.username.length > 0){
      email.to = ticket.assignto.username
      email.subject = `New support ticket is assigned to you`,
            await EmailService.send2(email)

    }
    else{
      let members = await departmentsTable.aggregate(
        [
          {$match:{id:department}},
          {$unwind:"$members"},
          
          {$project:{'members.username':1}}
        ]
      )
/*
db.departments.aggregate(
[
{$match:{id:'IT'}},
{$unwind:"$members"},
{$project:{'members.username':1}}
]
)
> db.departments.aggregate([{$match:{id:'IT'}},{$unwind:"$members"},{$project:{'members.username':1}}])
{ "_id" : ObjectId("66e88622bd87730ec9112311"), "members" : { "username" : "it@peerlinkmedical.com" } }
{ "_id" : ObjectId("66e88622bd87730ec9112311"), "members" : { "username" : "rquidilig@peerlinkmedical.com" } }
{ "_id" : ObjectId("66e88622bd87730ec9112311"), "members" : { "username" : "ray@peerlinkmedical.com" } }
{ "_id" : ObjectId("66e88622bd87730ec9112311"), "members" : { "username" : "ceo@peerlinkmedical.com" } }
{ "_id" : ObjectId("66e88622bd87730ec9112311"), "members" : { "username" : "dominique@peerlinkmedical.com" } }
> 
*/
    
      if(members && members.length > 0){
        email.subject = `New support ticket is assigned to ${department}`
        let mailing_list = ''
        for(m of members){
          if(m.members.username){
            const ema = opt_emails.find(ema => ema.email === m.members.username)
            if(ema){

              mailing_list = `${mailing_list}${m.members.username},`
            }            
          }
          
        }
        mailing_list = mailing_list.replace(/,$/, "")
        /*
        if (mailing_list.endsWith(",")) {
          mailing_list =  mailing_list.slice(0, -1);
        }
          */
        
        
        console.log(`415: mailing_list= ${mailing_list}`)
        if(mailing_list.length > 5){ 
          email.to = mailing_list//m.members.username
          await EmailService.send2(email)
        }
      }

    }
    
  
  }
  catch(ex){
    console.log(`createTicket() ex= ${ex.stack}`)
  }
  



  res.status(201).json(ticket)
})


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
const deleteTicket = asyncHandler(async (req,res)=>{
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
    throw new Error('Not authorized')
  }

  await ticket.deleteOne({id: ticket.id})

  res.status(200).json({success: 'true'})
})

// @desc Update user tickets
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async (req,res)=>{
  // get user using id and token
  console.log(`309: START: server updateTicket req.params= ${JSON.stringify(req.params,null,4)}`)
  //console.log(`309: START: server  updateTicket req.body= ${JSON.stringify(req.body,null,4)}`)
  //console.log(`309: START: server  updateTicket req.user= ${JSON.stringify(req.user,null,4)}`)
  if(!req.user){
    res.status(400)
    throw new Error('User not found')
  }

  const user = await User.findById(req.user.id)
  
  //const ticket = await Tickets.findById(req.params.id)
  const ticket = await ticketsTable.findOne({id:req.params.id}) //Tickets.findById(req.params.id)

  if(!ticket){
    res.status(404)
    throw new Error('Ticket not found')
  }
/*
  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('125: Not authorized')
  }
*/
  
//const updatedTicket = await Tickets.findByIdAndUpdate(req.params.id, req.body,{new:true})
let qry_set = {}
let subject = ""
let body = ""
let original_status = ticket.status

if(req.body["status"] != null && req.body.status != ticket.status){
  ticket.status = req.body.status
  switch(ticket.status){
    case 'new':
      ticket.status_id = 1
      break
    case 'assigned':
        ticket.status_id = 2
        break
    case 'closed':
      ticket.status_id = 3
      break
    default:
      ticket.status_id = 0
      break
      
        
  }
  qry_set["status"] = ticket.status
  qry_set["status_id"] = ticket.status_id

  qry_set["status_v2"] = {status_id:ticket.status_id,status:ticket.status,updatedAt: new Date()}
  
  if(ticket.status == "assigned"){
    /*if(req.body["assignto"] != null && req.body.assignto != ticket.assignto.username){
      ticket.assignto.username = req.body.assignto
      qry_set["assignto.username"] = ticket.assignto.username
    }
    */
    ticket.assignto = {username:user.email,name:user.name}
    qry_set["assignto"] = ticket.assignto


  }
}

if(req.body["solution"] != null){
  req.body.solution = req.body.solution.trim()
   if(req.body.solution.length > 0 && req.body.solution != ticket.solution){
    ticket.solution = req.body.solution
    qry_set["solution"] = ticket.solution
  }
}

let has_comments = false

let newnoteitem = ''

if(req.body["newnoteitem"] != null) {
  newnoteitem = req.body.newnoteitem.trim()
  if( newnoteitem.length > 0){
    if(ticket.notes == null){
      ticket.notes = []
    }
    ticket.notes.push({
      id: Date.now(), 
      createdAt:new Date(),
      createdby:user.email, 
      name: user.name,
      text: newnoteitem})
    qry_set["notes"] = ticket.notes
    has_comments = true

  }
}


console.log(`350: qry_set= ${JSON.stringify(qry_set,null,4)}`)


//const updatedTicket = Tickets.findByIdAndUpdate(req.params.id, req.body,{new:true})

if(Object.keys(qry_set).length > 0)
{

  await ticketsTable.update({id:req.params.id},{$set:qry_set}) //

  
    if(has_comments){
      subject = `${user.name} commented on ticket ${ticket.id}`
      body = `${newnoteitem}`

    }
    
    else{


      if(ticket.status != original_status){
        if(ticket.status == 'assigned'){
          subject = `Ticket# ${ticket.id} assigned`
          body = `<p>Ticket# ${ticket.id} assigned to ${ticket.assignto.name}</p>`
        }
    
        else if(ticket.status == 'closed'){
    
          subject = `Ticket# ${ticket.id} closed`
          body = `<p>Ticket# ${ticket.id} closed by ${user.name}</p>`
        }

      }
      
    } 

    if(subject.length > 0 && body.length > 0){
      
    
      const opt_emails = await usersTable.find({email_notification:false},{email:1})

      //let mailing_list = 'rquidilig@peerlinkmedical.com,rquidilig@gmail.com'
      //notify
      let members = await departmentsTable.aggregate(
        [
          {$match:{id:ticket.department}},
          {$unwind:"$members"},
          
          {$project:{'members.username':1}}
        ]
      )

      if(members && members.length > 0){
        let mailing_list = ''
        for(m of members){
          //if (m['username'] != null && m.username.length > 5 && m.username.includes('@')){
            if(m.members.username && m.members.username.length > 5 && m.members.username.includes('@')){
              const ema = opt_emails.find(ema => ema.email === m.members.username)
                if(ema){
                mailing_list = `${mailing_list}${m.members.username},`
              }
          }
          
        }
        mailing_list = mailing_list.replace(/,$/, "")
        /*if (mailing_list.endsWith(",")) {
          mailing_list =  mailing_list.slice(0, -1);
        }*/
        
        //if(m.members.username == 'rquidilig@peerlinkmedical.com'){
          console.log(`670: mailing_list= ${mailing_list}`)
          if(mailing_list.length > 5){ //we could have use < 0 but...
            
            let email = {
        
              from: 'noreply@physicianreviewservices.com',//'support@peerxc.com',
              to: mailing_list,//m.members.username,//'',//ticket.createdby.username,
              subject: subject,
              //body:`Dear Dr. X
              body: body
        
          }
            //email.to = m.members.username
            await EmailService.send2(email)
            
          }
        
      }
      else{
        console.log(`687: No members for department ${department}. Notification skipped!`)
      }
    }

    
  
}
  res.status(200).json(ticket)
})

const updateNotes = asyncHandler(async (req,res)=>{
  //const {product, department,member, description,notes,solution} = req.body
  console.log(`338: updateTicket req.body= ${JSON.stringify(req.body,null,4)}`)

  
  
//  console.log(`341: updateTicket product: ${product},description: ${description},department: ${department}`)



  // get user using id and token
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  const {ticketId} = req.body
 
  if(!ticketId){
    res.status(500)
    throw new Error('Invalid ticketId')
  }


  let qry_set ={}

  Object.entries(myObject).forEach(([k,v]) => {
    if(k !== 'ticketId'){
      qry_set['k'] = v
    }
  })

  if(Object.keys(qry_set).length == 0){
    res.status(501)

  }

  let ticket = await ticketsTable.findOne({id_num:ticketId})
  if(!ticket){
    res.status(502)
    
  }

  // check if user can update

  const depts = await departmentsTable.aggregate(
    [
      {$unwind:"$members"},
      {$match:{"members.username":user.email}},
      
      {$project:{'name':1}}
    ]
  )
  //{ "_id" : ObjectId("66e88622bd87730ec9112311"), "name" : "IT" }

 
if(depts && depts.length > 0){
  
}
else{
  res.status(503)
}

  
  
  

  


/*

if(member){
  assigntouser = await usersTable.findOne({email:member})
}

if(assigntouser == null){
  assigntouser = {username:'',name:''}
}
else{
  assigntouser = {username:assigntouser.email,name:assigntouser.name}
}
*/
/*
await ticketsTable.insert({
  id:  new_id,
  id_num: next_id, 
  department:department,
  product:product,
  description:description,
  solution:'',
  user: req.user.id,
  //email: user.email,
  //name: user.name,
  createdby:{username:user.email,name:user.name},
  assignto:assigntouser,
  status: 'new',
  createdAt: new Date()
})
*/
qry_set['updatedAt'] =  new Date()
await ticketsTable.update({id: existing_ticket.id},{$set:qry_set })



  
  console.log(`78: ticket ${existing_ticket.id} updated`)

  //notify
  
  let subject = `New update has been posted for ticket ${ticket.id}`

  if(qry_set['notes'] != null && qry_set.notes.length > 0){
    subject= `New message has been posted for ticket ${ticket.id}`
  }
  let body = `
  <p>Hi,</p>
  
  <p>Department: ${ticket.department}</p>
                                      
  <p>Ticket#: ${ticket.id}</p>
  <p>Message: ${qry_set.notes}</p>
  <br>
  <br>
  
  <p>Thank you,</p>
  Support Team
  `

  try{

    let email = {
          
      from:'support@peerxc.com',
      to: '',
      subject: subject,//`New support ticket is assigned to ${department}`,
      //body:`Dear Dr. X
      body: `
      <p>Hi,</p>
      
      <p>Department: ${ticket.department}</p>
                                          
      <p>Ticket#: ${ticket.id}</p>
      
      <br>
      <br>
      
      <p>Thank you,</p>
      Support Team
      `
    }

    /*
    if(ticket.assignto.length > 0){
      email.to = ticket.assignto
      email.subject = `New support ticket is assigned to you`,
            await EmailService.send2(ticket.assignto)

    }
    else{
      */
      let members = await departmentsTable.aggregate(
        [
          {$match:{id:department}},
          {$unwind:"$members"},
          
          {$project:{'members.username':1}}
        ]
      )
    
      if(members && members.length > 0){
        //email.subject = `New support ticket is assigned to ${department}`
        
        for(m of members){
          if(m.members.username){
            email.to = m.members.username
            await EmailService.send2(email)
          }
        }
      }
  
      
  }
  catch(ex){
    console.log(`createTicket() ex= ${ex.stack}`)
  }
  
  res.status(201).json(ticket)
})





module.exports = {
  createTicket,
  getTickets,
  getTicket,

  deleteTicket,
  updateTicket,
  updateNotes
}

/*
db.departments.update({id:'IT'},{$set:{"members" : [
{
"username" : "it@physicianreviewservices.com",
"name" : ""
},
{
"username" : "rquidilig@gmail.com",
"name" : "Rom The Great"
},
{
"username" : "sam.yamini@physicianreviewservices.com",
"name" : "Sam Yamini"
}
]}})
*/


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