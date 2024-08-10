const express = require('express')
const authController = require('../controller/usercontroller')
const middleware = require('../middleware/authMiddleware')
const router = express.Router()
const handler = require('../middleware/handler')

router.post('/register',  authController.register)

router.get('/allUsers',  middleware.authenticate, middleware.admin, authController.allUsers )

router.post("/login", authController.login)

router.post('/logout', authController.logout)


router.put('/:id/admin', middleware.authenticate, authController.makeAdmin)

router.get('/singleUser/:id', middleware.authenticate, middleware.admin, authController.singleUser)

router.put('/profile', middleware.authenticate, authController.updateProfile)

router.delete('/deleteUser/:id',  middleware.authenticate, middleware.admin, authController.deleteUser )

router.put('/updateById/:id', middleware.authenticate, middleware.admin, authController.updateUserById)

module.exports = router;