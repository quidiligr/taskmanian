const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getMe,updateMe, loginFromInvite, adminCreateUser} = require('../controllers/userController')

const {protect}  = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/admin-create-user',protect, adminCreateUser)
router.post('/login', loginUser)
router.post('/login-from-invite', loginFromInvite)
router.post('/updateme', protect, updateMe)

router.get('/getme', protect, getMe)

router.get('/me', protect, getMe)

module.exports = router