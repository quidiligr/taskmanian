const express = require('express')
const router = express.Router()
//const {getTickets, createTicket, getTicket,updateTicket, deleteTicket} = require('../controllers/ticketController')
const {getDepartments, createDepartment, getDepartment,updateDepartment, deleteDepartment} = require('../controllers/departmentController')
const {protect}  = require('../middleware/authMiddleware')

// Re-route into noteRouter
//const noteRouter = require('./noteRoutes');
//router.use('/:ticketId/notes', noteRouter)

router.route('/').get(protect, getDepartments).post(protect, createDepartment)

router.route('/:id').get(protect, getDepartment).put(protect, updateDepartment).delete(protect, deleteDepartment)

module.exports = router