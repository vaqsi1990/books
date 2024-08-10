const express = require('express');
const router = express.Router();
const middleware = require('../middleware/authMiddleware');
const orderRoute = require('../controller/order');

router.post('/create', middleware.authenticate, orderRoute.create);

router.get('/allorders', middleware.authenticate,  orderRoute.allOrders);

router.get('/userOrders', middleware.authenticate, orderRoute.userOrders);

router.get('/totalorders', middleware.authenticate, middleware.admin, orderRoute.totalOrders);

router.get('/totalsales', middleware.authenticate, middleware.admin, orderRoute.totalSales);

router.get('/salesbydate', middleware.authenticate, middleware.admin, orderRoute.salesByDate);

router.get('/:id', middleware.authenticate, orderRoute.orderById);

router.put('/:id/pay', middleware.authenticate, orderRoute.pay);

router.put('/:id/deliver', middleware.authenticate, middleware.admin, orderRoute.delivered);

module.exports = router;
