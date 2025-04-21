const Order = require('../models/orderModel');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, totalPriceAfterDiscount, discountName } = req.body;

    if (
      !orderItems ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0 ||
      totalPrice === undefined ||
      totalPriceAfterDiscount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: orderItems, totalPrice, or totalPriceAfterDiscount',
      });
    }

    for (const item of orderItems) {
      if (!item.productName || item.price === undefined || item.quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Each order item must include productName, price, and quantity',
        });
      }
    }

    const order = new Order({
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      discountName,
      dueAmount: totalPriceAfterDiscount,
      paymentStatus: 'pending',
      status: 'pending', // Initialize status as pending
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
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
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      error: error.message,
    });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const { status, ...otherUpdates } = req.body;

    // Validate status update based on dueAmount
    if (status) {
      if (order.dueAmount > 0 && status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Order status cannot be updated to anything other than pending while due amount is greater than 0',
        });
      }
      if (order.dueAmount === 0 && status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Order status cannot be set to pending when due amount is 0',
        });
      }
      order.status = status;
    }

    // Apply other updates (e.g., shippingAddress, etc.)
    Object.assign(order, otherUpdates);

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message,
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
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      order: deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};