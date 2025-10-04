const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
//const Tickets = require('../models/ticketModel')
const bcrypt = require('bcryptjs')
const config = require('../config/config')

const monk = require('monk');
const db = monk(config.kMongoDb)
const usersTable = db.get('users')
const departmentsTable = db.get('departments')
const companiesTable = db.get('companies')

const invitesTable = db.get('invites')
const regsTable = db.get('regs')

const EmailService = require('../services/email.service')

const {v4:uuid} = require('uuid')

//const departmentsTable = db.get('departments')

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
  try{

  
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
        
        const {company, department,contactemail,contactname,notifyuser} = req.body

        const email = contactemail.trim()
        const name = contactname.trim()

        console.log(`230: department= ${department},email= ${email},name= ${name}`)

        if(email && name){



        }
        else{
            console.log('230: department, email, name required!')
            res.status(400)
            
            throw new Error('department, email, name required!')
        }

        let company_id = company.trim().toUpperCase()
        let department_id = department.trim().toUpperCase()

        let existing_company = await  companiesTable.find({id:company_id})
        if(!existing_company){
          await  companiesTable.insert({id:company_id,name:company_id,departments:[]})
          existing_company =  await  companiesTable.find({id:company_id})
        }



        let existing_department = await departmentsTable.findOne({id:department_id,company:company_id})

//db.departments.update({id:'DATACARE','members.username':'sam.yamini@peerlinkmedical.com'},{$set:{'members.$.name':'Sam Yamini'}})
        console.log(`234: dept= ${JSON.stringify(existing_department,null,4)}`)
        //create department if needed
          
        if(!existing_department){
          const new_dept = {
            id:department_id,
            name: department_id,
            department:department_id,
            company:company_id,
            priority:0,
            members:[{username:email,name:name}],
            products:[{id:'',name:''}]

          }
          await  departmentsTable.insert(new_dept)
          console.log('251: Invalid department!')
            //res.status(400)
            //throw new Error('Invalid department!')
        }
        else{
          // just add user to department
          await departmentsTable.update({id:department_id},{$push:{members:{username:email,name:name}}})
        }

        // create user if needed
        const existing_user = await usersTable.findOne({email:email})

        console.log(`234: existing_user= ${JSON.stringify(existing_user,null,4)}`)

        if(!existing_user){
            let password = uuid()
            password = password.replace('-','')
            password = password.substring(0,7)
            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(password, salt)

            await usersTable.insert({
            name : name,
            email : email,
            password : hashedPass,
            isAdmin : false,
            createdAt : new Date(),
            updatedAt : new Date(),
            __v : 0,
            status : "ACTIVE",
            isActive : true
            })
            
            await regsTable.update( {
              email:email},{$set:{
            name:name,
            email: email,
            password:password,
            hashedPass: hashedPass
            }},{upsert:true})
            
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
            //await invitesTable.insert(invite)
            await invitesTable.update({email:email},{$set:{invite}})

            console.log('284:')

        } 

        
        console.log('289:')

        if(notifyuser){
          let firstname = ''
        
        if(name){
            firstname= name.split(' ')
            firstname = firstname[0]
        }
            let subject = `Invitation to Join Taskmanian`
            let body = `<p>Hi ${firstname},</p><p>We invite you to join the Taskmanian, where you can easily access assistance, resources, and updates tailored to your needs.</p>
                                                
            <p><a href="https://taskmaniancom/login/${invite.id}">Click here to join</a></p>
            
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
       
        console.log(`323: Send invite to ${email}...`)
        await EmailService.send2(email_info)

        
        // Tickets.findByIdAndUpdate(req.params.id, req.body,{new:true})

        console.log(`329: Send invite to ${email} success!!!`)

        }

        

        res.status(200).json({message:'Sent'})
    }
    catch(ex){
      console.log(`ex.stack= ${ex.stack}`)
      console.log(`ex.message= ${ex.message}`)
      res.status(400)
  
      
      throw new (ex.message ? ex.message : 'Internal server error!')
    }
    
})


module.exports = {
  
  sendInvite,
  getInvites,
  //getInvite,
  //loginInvite,
  deleteInvite
  
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