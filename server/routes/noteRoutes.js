const express = require('express')
const router = express.Router({mergeParams: true})
const {getNotes, addNote} = require('../controllers/noteController')

const {protect} = require('../middleware/authMiddleware')

router.route('/:ticketId').get(protect, getNotes)
//router.route('/').get(protect, getNotes).post(protect, addNote)
router.route('/').post(protect, addNote)

module.exports = router