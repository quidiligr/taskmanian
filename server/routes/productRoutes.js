const express = require('express')
const router = express.Router({mergeParams: true})
const {getProducts, addProduct} = require('../controllers/productController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getProducts).post(protect, addProduct)

module.exports = router