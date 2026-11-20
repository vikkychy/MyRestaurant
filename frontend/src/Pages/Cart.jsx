import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
    const {
        cartItems,
        cartTotal,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    return (
        <main className="cart-page">
            <div className="cart-container">

                <div className="cart-heading">
                    <span>YOUR ORDER</span>
                    <h1>Shopping Cart</h1>
                    <p>Review your selected food items.</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <ShoppingBag size={55} />
                        <h2>Your cart is empty</h2>
                        <p>You haven't added any food items yet.</p>

                        <Link to="/menu" className="continue-shopping">
                            Explore Menu
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">

                            {cartItems.map(item => (
                                <div className="cart-item" key={item._id}>

                                    <img
                                        src={
                                            item.image ||
                                            'https://placehold.co/150x150?text=Food'
                                        }
                                        alt={item.name}
                                    />

                                    <div className="cart-item-info">
                                        <span>{item.category}</span>
                                        <h3>{item.name}</h3>
                                        <strong>
                                            Rs. {item.price.toLocaleString('en-IN')}
                                        </strong>
                                    </div>

                                    <div className="cart-quantity">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={item.quantity === 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <strong>{item.quantity}</strong>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity + 1
                                                )
                                            }
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        <strong>
                                            Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                                        </strong>

                                        <button
                                            className="remove-cart-item"
                                            onClick={() => removeFromCart(item._id)}
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                </div>
                            ))}

                        </div>

                        <div className="cart-summary">
                            <div>
                                <span>Total Items</span>
                                <strong>
                                    {cartItems.reduce(
                                        (total, item) => total + item.quantity,
                                        0
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Grand Total</span>
                                <strong className="cart-grand-total">
                                    Rs. {cartTotal.toLocaleString('en-IN')}
                                </strong>
                            </div>

                            <div className="cart-actions">
                                <Link to="/menu" className="continue-shopping">
                                    Continue Shopping
                                </Link>

                                <button
                                    className="clear-cart-button"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>

                                <Link to="/checkout" className="checkout-button">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </main>
    );
}

export default Cart;