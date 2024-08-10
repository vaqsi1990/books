const express = require('express')
const categoryController = require('../controller/category')
const middleware = require('../middleware/authMiddleware')
const router = express.Router()
const handler = require('../middleware/handler')

router.post('/create',middleware.authenticate, middleware.admin,  categoryController.create)

router.put('/:id', middleware.authenticate, middleware.admin, categoryController.updateCategory )

router.delete('/:categoryId', middleware.authenticate, middleware.admin, categoryController.removeCategory )

router.get('/allCategory', middleware.authenticate, middleware.admin, categoryController.allCategory )
router.get('/:id', middleware.authenticate, middleware.admin, categoryController.readCategory )
module.exports = router;