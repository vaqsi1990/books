const express = require('express')
const productController = require('../controller/product')
const middleware = require('../middleware/authMiddleware')
const router = express.Router()
const handler = require('../middleware/handler')
const formidable = require('express-formidable')
const checkId = require('../middleware/checkId')

router.post('/addProduct', middleware.authenticate, middleware.admin,   productController.addProduct)

router.put('/updateProduct/:id', middleware.authenticate, middleware.admin, productController.updateProduct)

router.delete('/:id', middleware.authenticate, middleware.admin, productController.removeProduct)



router.get('/fetchProducts', productController.fetchProducts)

router.get('/allproduct', productController.fetchAllProducts)

router.post('/:id/reviews', middleware.authenticate,  productController.addProductReview)

router.get('/singleProduct/:id', productController.singleProduct)

router.get('/top', productController.topProduct)
router.get('/new', productController.fetchNewProducts)

router.post('/filter', productController.filter)

module.exports = router;