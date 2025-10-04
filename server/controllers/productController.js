const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Notes = require('../models/noteModel')
const Tickets = require('../models/ticketModel')
const config = require('../config/config')
const monk = require('monk');
const db = monk(config.kMongoDb)
const usersTable = db.get('users')
const productsTable = db.get('products')
const departmentsTable = db.get('departments')


// @desc Get notes for a ticket
// @route GET /api/tickets/:ticketId/notes
// @access Private
const getProducts = asyncHandler(async (req,res)=>{
  // get user using id and token
  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  

  /*
  const dept = await Tickets.findById(req.params.ticketId)

  if(ticket.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('22: User not autorized')
  }
*/
  const products = productsTable.find({departmentId:req.params.departmentId}) //await Notes.find({ticket: req.params.ticketId})

  res.status(200).json(products)
})

// @desc Create ticket note
// @route GET /api/tickets/:ticketId/notes
// @access Private
const addProduct = asyncHandler(async (req,res)=>{
  //const product = await productsTable.findOne({name:req.params.name})
 //Tickets.findById(req.params.ticketId)
/*
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('38: User not authorized')
  }
  */
  const {name,departmentId} = req.body
  //const {user} = req

  const user = await User.findById(req.user.id)

  if(!user){
    res.status(400)
    throw new Error('User not found')
  }


  if(!user.isAdmin){
    res.status(400)
    throw new Error('22: User not autorized')
  }

  let product = await productsTable.findOne({departmentId:departmentId, name:name}) 
  if(!product){
    
        await productsTable.insert({  //Notes.create({
            id: name,
            departmentId: req.body.departmentId,
            name: name,
            
        })

    product = await productsTable.findOne({})
    }

  res.status(200).json(product)

})

module.exports = {
  getProducts,
  addProduct
}