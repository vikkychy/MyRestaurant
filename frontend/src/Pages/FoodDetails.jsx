import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import './FoodDetails.css';

function FoodDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [food, setFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await api.get(`/foods/${id}`);
                setFood(response.data.food);
            } catch (err) {
                console.error('Food details error:', err);
                setError('Unable to load food details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [id]);

    const increaseQuantity = () => {
        setQuantity(current => current + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(current => Math.max(1, current - 1));
    };

    if (loading) {
        return (
            <main className="food-details-page">
                <p className="details-message">Loading food details...</p>
            </main>
        );
    }

    if (error || !food) {
        return (
            <main className="food-details-page">
                <div className="details-error">
                    <UtensilsCrossed size={45} />
                    <h2>Food Not Found</h2>
                    <p>{error || 'This food item does not exist.'}</p>
                    <Link to="/menu" className="back-button">
                        <ArrowLeft size={18} />
                        Back to Menu
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="food-details-page">
            <div className="food-details-container">

                <Link to="/menu" className="details-back-link">
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>

                <section className="food-details-content">

                    <div className="details-image">
                        <img
                            src={
                                food.image?.url ||
                                'https://placehold.co/700x550?text=Food+Image'
                            }
                            alt={food.name}
                        />

                        <span className={food.isAvailable ? 'status-available' : 'status-unavailable'}>
                            {food.isAvailable ? 'Available' : 'Currently Unavailable'}
                        </span>
                    </div>

                    <div className="details-information">

                        <span className="details-category">
                            {food.category?.name || 'Our Food'}
                        </span>

                        <h1>{food.name}</h1>

                        <p className="details-description">
                            {food.description || 'Enjoy this delicious food prepared with quality ingredients.'}
                        </p>

                        <div className="details-price">
                            Rs. {Number(food.price).toLocaleString('en-IN')}
                        </div>

                        <div className="details-divider"></div>

                        <div className="quantity-section">
                            <span>Quantity</span>

                            <div className="quantity-control">
                                <button
                                    onClick={decreaseQuantity}
                                    disabled={quantity === 1}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={17} />
                                </button>

                                <strong>{quantity}</strong>

                                <button
                                    onClick={increaseQuantity}
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={17} />
                                </button>
                            </div>
                        </div>

                        <div className="details-total">
                            <span>Total Price</span>
                            <strong>
                                Rs. {(food.price * quantity).toLocaleString('en-IN')}
                            </strong>
                        </div>

                        <button
                            className="details-cart-button"
                            disabled={!food.isAvailable}
                            onClick={() => {
                                addToCart(food, quantity);
                                alert(`${food.name} added to cart!`);
                            }}
                        >
                            <ShoppingCart size={20} />
                            {food.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
                        </button>

                    </div>
                </section>
            </div>
        </main>
    );
}

export default FoodDetails;