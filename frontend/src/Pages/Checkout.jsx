import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    MapPin,
    Phone,
    User,
    Mail,
    CreditCard,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import api from '../services/api';

import './Checkout.css';

function Checkout() {
    const {
        cartItems,
        cartTotal,
        clearCart
    } = useCart();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: 'cod'
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '');

            if (numbersOnly.length > 10) return;

            setFormData(current => ({
                ...current,
                phone: numbersOnly
            }));
        } else {
            setFormData(current => ({
                ...current,
                [name]: value
            }));
        }

        setError('');
    };

    // Place order
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!/^9\d{9}$/.test(formData.phone)) {
            setError(
                'Enter a valid 10-digit Nepal phone number starting with 9.'
            );
            return;
        }

        if (cartItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const orderData = {
                customerName: formData.name.trim(),
                phone: formData.phone,
                email: formData.email.trim(),
                deliveryAddress: formData.address.trim(),
                paymentMethod: 'COD',

                items: cartItems.map(item => ({
                    food: item._id,
                    quantity: item.quantity
                }))
            };

            const response = await api.post('/orders/new', orderData);

            if (response.data.success) {
                const order = response.data.order;

                // Clear cart after successful order placement
                clearCart();

                // Navigate to confirmation page
                navigate('/order-confirmation', {
                    state: { order }
                });
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to place your order. Please try again.'
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <main className="checkout-page">
                <div className="checkout-empty">
                    <div className="empty-icon">
                        <ShoppingBag size={42} />
                    </div>

                    <h2>Your cart is empty</h2>

                    <p>
                        Add some delicious food before proceeding to checkout.
                    </p>

                    <Link to="/menu" className="checkout-primary-button">
                        Explore Menu
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="checkout-container">

                {/* Page Heading */}
                <div className="checkout-heading">
                    <span className="checkout-eyebrow">
                        ALMOST THERE
                    </span>

                    <h1>Checkout</h1>

                    <p>
                        Complete your delivery information and confirm your order.
                    </p>
                </div>

                <div className="checkout-content">

                    {/* Checkout Form */}
                    <form
                        className="checkout-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Delivery Information */}
                        <section className="checkout-section">

                            <div className="section-heading">
                                <div className="section-icon">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <h2>Delivery Information</h2>
                                    <p>
                                        Where should we deliver your order?
                                    </p>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="checkout-field">
                                <label htmlFor="name">
                                    Full Name <span>*</span>
                                </label>

                                <div className="input-wrapper">
                                    <User size={19} />

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        maxLength={100}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="checkout-field">
                                <label htmlFor="phone">
                                    Phone Number <span>*</span>
                                </label>

                                <div className="phone-input-group">

                                    <div className="country-code">
                                        <span>🇳🇵</span>
                                        <strong>+977</strong>
                                    </div>

                                    <div className="input-wrapper phone-number-input">
                                        <Phone size={19} />

                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="98XXXXXXXX"
                                            inputMode="numeric"
                                            pattern="9[0-9]{9}"
                                            minLength={10}
                                            maxLength={10}
                                            title="Enter exactly 10 digits starting with 9."
                                            autoComplete="tel-national"
                                            required
                                        />
                                    </div>

                                </div>

                                <small className="field-hint">
                                    Enter your 10-digit mobile number starting with 9.
                                </small>
                            </div>

                            {/* Email */}
                            <div className="checkout-field">
                                <label htmlFor="email">
                                    Email Address <small>(Optional)</small>
                                </label>

                                <div className="input-wrapper">
                                    <Mail size={19} />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="checkout-field">
                                <label htmlFor="address">
                                    Address to be Delivered <span>*</span>
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your complete delivery address, including area, street, house number or nearby landmark..."
                                    rows="4"
                                    maxLength={500}
                                    autoComplete="street-address"
                                    required
                                />

                                <small className="field-hint">
                                    Please provide a clear address to help us deliver your order.
                                </small>
                            </div>

                        </section>

                        {/* Payment Method */}
                        <section className="checkout-section payment-section">

                            <div className="section-heading">
                                <div className="section-icon">
                                    <CreditCard size={20} />
                                </div>

                                <div>
                                    <h2>Payment Method</h2>
                                    <p>Select how you want to pay.</p>
                                </div>
                            </div>

                            <label className="payment-option">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleChange}
                                />

                                <div className="payment-details">
                                    <strong>Cash on Delivery</strong>

                                    <p>
                                        Pay when your order arrives at your doorstep.
                                    </p>
                                </div>

                                <span className="payment-badge">
                                    Available
                                </span>

                            </label>

                        </section>

                        {/* Error Message */}
                        {error && (
                            <div className="checkout-error" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Place Order Button */}
                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={isSubmitting}
                        >
                            <ShoppingBag size={19} />

                            {isSubmitting
                                ? 'Placing Your Order...'
                                : 'Place Order'
                            }
                        </button>

                        <p className="checkout-security">
                            <ShieldCheck size={16} />

                            Your information will be used to process your order.
                        </p>

                    </form>

                    {/* Order Summary */}
                    <aside className="checkout-summary">

                        <div className="summary-heading">
                            <h2>Order Summary</h2>

                            <span>
                                {cartItems.length} Items
                            </span>
                        </div>

                        {/* Cart Items */}
                        <div className="checkout-summary-items">

                            {cartItems.map(item => (
                                <div
                                    className="checkout-summary-item"
                                    key={item._id}
                                >

                                    <div className="summary-item-image">
                                        <img
                                            src={
                                                item.image ||
                                                'https://placehold.co/100x100?text=Food'
                                            }
                                            alt={item.name}
                                        />

                                        <span>{item.quantity}</span>
                                    </div>

                                    <div className="summary-item-info">
                                        <h4>{item.name}</h4>

                                        <span>
                                            Rs. {item.price.toLocaleString('en-IN')} × {item.quantity}
                                        </span>
                                    </div>

                                    <strong className="summary-item-price">
                                        Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                                    </strong>

                                </div>
                            ))}

                        </div>

                        {/* Calculation */}
                        <div className="summary-calculation">

                            <div>
                                <span>Subtotal</span>

                                <strong>
                                    Rs. {cartTotal.toLocaleString('en-IN')}
                                </strong>
                            </div>

                            <div>
                                <span>Delivery Fee</span>

                                <strong>To be confirmed</strong>
                            </div>

                        </div>

                        {/* Grand Total */}
                        <div className="checkout-total">
                            <span>Grand Total</span>

                            <strong>
                                Rs. {cartTotal.toLocaleString('en-IN')}
                            </strong>
                        </div>

                        {/* Back to Cart */}
                        <Link to="/cart" className="back-to-cart">
                            <ArrowLeft size={17} />
                            Back to Cart
                        </Link>

                    </aside>

                </div>
            </div>
        </main>
    );
}

export default Checkout;