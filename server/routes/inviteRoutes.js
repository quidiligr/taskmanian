const express = require('express')
const router = express.Router()
//const {getTickets, createTicket, getTicket,updateTicket, deleteTicket} = require('../controllers/ticketController')
const {sendInvite} = require('../controllers/inviteController')
const {protect}  = require('../middleware/authMiddleware')

// Re-route into noteRouter
//const noteRouter = require('./noteRoutes');
//router.use('/:ticketId/notes', noteRouter)
//router.route('/').post(protect, getInvites)
//router.route('/get-invite').post(protect, getInvite)
//router.route('/remove-invite').post(protect, deleteInvite)

//router.route('/login-invite').post(protect, loginInvite)
router.route('/send-invite').post(protect, sendInvite)

//router.route('/send').put(protect, sendInvite)
//router.route('/:id').get(protect, getInvite).delete(protect, deleteInvite)

module.exports = router