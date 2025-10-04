const express = require('express')
const { passwordReset } = require('../../client/src/features/account/accountSlice')
const router = express.Router()
//const {getTickets, createTicket, getTicket,updateTicket, deleteTicket} = require('../controllers/ticketController')
const {sendInvite,updateMyAccount,getMyAccount} = require('../controllers/acccountController')
const {protect}  = require('../middleware/authMiddleware')

// Re-route into noteRouter
//const noteRouter = require('./noteRoutes');
//router.use('/:ticketId/notes', noteRouter)
//router.route('/').get(protect, getMyAccount)
router.route('/').get(protect, getMyAccount)//.post(protect, createTicket)

router.route('/updatemyaccount').post(protect, updateMyAccount)

//router.route('/get-invite').post(protect, getInvite)
//router.route('/remove-invite').post(protect, deleteInvite)

//router.route('/login-invite').post(protect, loginInvite)
router.route('/send-invite').post(protect, sendInvite)
//router.route('/password-reset').post(protect, passwordReset)
//router.route('/password-reset-start').post(protect, passwordResetStart)

//router.route('/send').put(protect, sendInvite)
//router.route('/:id').get(protect, getInvite).delete(protect, deleteInvite)

module.exports = router