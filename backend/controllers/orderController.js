import Payment from '../models/paymentModel.js';
import Order from '../models/orderModel.js';
import Food from '../models/foodModel.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !deliveryAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required order details'
      });
    }

    const allowedPaymentMethods = ['COD', 'eSewa', 'Khalti'];
    const selectedPaymentMethod = paymentMethod || 'COD';

    if (!allowedPaymentMethods.includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food);

      if (!food || !food.isAvailable) {
        return res.status(404).json({
          success: false,
          message: `Food item not available: ${item.food}`
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid food quantity'
        });
      }

      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity
      });

      totalAmount += food.price * quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod: selectedPaymentMethod
    });

    try {
      await Payment.create({
        order: order._id,
        customer: req.user._id,
        amount: totalAmount,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: 'Pending'
      });
    } catch (error) {
      await Order.findByIdAndDelete(order._id);
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get logged-in customer's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('items.food', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready',
      'Delivered',
      'Cancelled'
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};