const Order = require('../models/orderModel');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            totalPrice,
            totalPriceAfterDiscount,
            discountName
        } = req.body;

        // Validate required fields
        if (
            !orderItems || !Array.isArray(orderItems) || orderItems.length === 0 ||
            totalPrice === undefined || totalPriceAfterDiscount === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: orderItems, totalPrice, or totalPriceAfterDiscount"
            });
        }

        // Validate each order item
        for (const item of orderItems) {
            if (!item.productName || item.price === undefined || item.quantity === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Each order item must include productName, price, and quantity"
                });
            }
        }

        const order = new Order({
            orderItems,
            totalPrice,
            totalPriceAfterDiscount,
            discountName
        });

        const savedOrder = await order.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating order",
            error: error.message
        });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve orders",
            error: error.message
        });
    }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving order",
            error: error.message
        });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update order",
            error: error.message
        });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            order: deletedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete order",
            error: error.message
        });
    }
};

// const orderPayment = async(req, res)=>{
//     const {id}=req.query;
//     const Data= await Order.findById(id);
   
//     res.send(Data)
// }


const orderPayment = async(req, res) => {
    const { id } = req.params; // Change from req.query to req.params
    try {
        const Data = await Order.findById(id);
        if (!Data) {
            return res.status(404).send('Order not found');
        }
        res.send(Data);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).send('Server error');
    }
}

// For creating payment
const createPayment = async(req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        
        // Add new payment to order's payments array
        order.payments.push(req.body);
        await order.save();
        
        res.status(201).send(order.payments[order.payments.length - 1]);
    } catch (err) {
        console.error('Error creating payment:', err);
        res.status(500).send('Server error');
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    orderPayment,
    createPayment
};
