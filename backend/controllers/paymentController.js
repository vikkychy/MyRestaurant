import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';

// Get logged-in customer's payments
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate('order', 'totalAmount orderStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name email')
      .populate('order', 'totalAmount orderStatus paymentStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update payment status (Admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const order = await Order.findById(payment.order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Related order not found'
      });
    }

    payment.paymentStatus = paymentStatus;
    order.paymentStatus = paymentStatus;

    await payment.save();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment and order status updated successfully',
      payment,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};