import { Link, useLocation, Navigate } from 'react-router-dom';
import {
    CheckCircle,
    Package,
    MapPin,
    Phone,
    User,
    CreditCard,
    ShoppingBag,
    Home
} from 'lucide-react';

import './OrderConfirmation.css';

function OrderConfirmation() {
    const location = useLocation();
    const order = location.state?.order;

    // Prevent access without a successfully placed order
    if (!order) {
        return <Navigate to="/menu" replace />;
    }

    const formatPrice = (price) =>
        Number(price).toLocaleString('en-IN');

    const orderDate = new Date(order.createdAt || Date.now());

    return (
        <main className="confirmation-page">
            <div className="confirmation-container">

                {/* Success Message */}
                <div className="confirmation-success">
                    <div className="success-icon">
                        <CheckCircle size={55} />
                    </div>

                    <span className="confirmation-eyebrow">
                        ORDER SUCCESSFUL
                    </span>

                    <h1>Thank You for Your Order!</h1>

                    <p>
                        Your order has been received successfully.
                        We'll prepare your food shortly.
                    </p>
                </div>

                {/* Order ID */}
                <div className="confirmation-order-id">
                    <div>
                        <span>YOUR ORDER ID</span>
                        <h2>#{order._id}</h2>
                    </div>

                    <div className="order-status">
                        {order.orderStatus || 'Pending'}
                    </div>
                </div>

                <div className="confirmation-content">

                    {/* Order Details */}
                    <section className="confirmation-card">

                        <div className="confirmation-card-heading">
                            <Package size={21} />
                            <h2>Order Details</h2>
                        </div>

                        <div className="confirmation-items">

                            {order.items.map((item, index) => (
                                <div
                                    className="confirmation-item"
                                    key={item._id || item.food || index}
                                >
                                    <div className="confirmation-item-info">
                                        <h3>{item.name}</h3>

                                        <span>
                                            Rs. {formatPrice(item.price)} × {item.quantity}
                                        </span>
                                    </div>

                                    <strong>
                                        Rs. {formatPrice(item.price * item.quantity)}
                                    </strong>
                                </div>
                            ))}

                        </div>

                        <div className="confirmation-total">
                            <span>Grand Total</span>

                            <strong>
                                Rs. {formatPrice(order.totalAmount)}
                            </strong>
                        </div>

                    </section>

                    {/* Delivery Information */}
                    <section className="confirmation-card">

                        <div className="confirmation-card-heading">
                            <MapPin size={21} />
                            <h2>Delivery Information</h2>
                        </div>

                        <div className="confirmation-info">

                            <div>
                                <User size={18} />
                                <div>
                                    <span>Customer Name</span>
                                    <strong>{order.customerName}</strong>
                                </div>
                            </div>

                            <div>
                                <Phone size={18} />
                                <div>
                                    <span>Phone Number</span>
                                    <strong>{order.phone}</strong>
                                </div>
                            </div>

                            <div>
                                <MapPin size={18} />
                                <div>
                                    <span>Delivery Address</span>
                                    <strong>{order.deliveryAddress}</strong>
                                </div>
                            </div>

                            {order.email && (
                                <div>
                                    <User size={18} />
                                    <div>
                                        <span>Email Address</span>
                                        <strong>{order.email}</strong>
                                    </div>
                                </div>
                            )}

                        </div>

                    </section>

                </div>

                {/* Payment Information */}
                <div className="confirmation-payment">
                    <CreditCard size={21} />

                    <div>
                        <span>Payment Method</span>
                        <strong>
                            {order.paymentMethod === 'COD'
                                ? 'Cash on Delivery'
                                : order.paymentMethod}
                        </strong>
                    </div>

                    <span className="payment-pending">
                        {order.paymentStatus || 'Pending'}
                    </span>
                </div>

                {/* Order Date */}
                <p className="confirmation-date">
                    Order placed on: {orderDate.toLocaleString()}
                </p>

                {/* Action Buttons */}
                <div className="confirmation-actions">

                    <Link to="/menu" className="confirmation-primary-button">
                        <ShoppingBag size={19} />
                        Continue Shopping
                    </Link>

                    <Link to="/" className="confirmation-home-button">
                        <Home size={19} />
                        Back to Home
                    </Link>

                </div>

                <p className="confirmation-thankyou">
                    Thank you for choosing MyRestaurant!
                </p>

            </div>
        </main>
    );
}

export default OrderConfirmation;