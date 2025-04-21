const express = require('express');
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder ,orderPayment,createPayment} = require('../controllers/order.controller');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get("/orderdisplay/:id", orderPayment); // Use params instead of query
router.post("/orderdisplay/:id/payments", createPayment);


module.exports = router;