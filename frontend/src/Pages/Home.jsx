import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

function Home() {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [foodResponse, categoryResponse] = await Promise.all([
                    api.get('/foods'),
                    api.get('/categories')
                ]);

                setFoods(foodResponse.data.foods || []);
                setCategories(categoryResponse.data.categories || []);
            } catch (error) {
                console.error('Failed to load homepage data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <main className="home-page">

            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-tag">WELCOME TO MYRESTAURANT</span>

                    <h1>
                        Delicious Food,
                        <br />
                        <span>Made With Love.</span>
                    </h1>

                    <p>
                        Enjoy freshly prepared meals made with quality
                        ingredients. Great taste, great moments, every time.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/menu" className="primary-button">
                            Explore Menu <ArrowRight size={18} />
                        </Link>

                        <div className="hero-rating">
                            <Star size={18} fill="#e87532" color="#e87532" />
                            <span>Delicious moments await</span>
                        </div>
                    </div>

                    <div className="hero-features">
                        <div>
                            <Clock size={20} />
                            <span>Freshly Prepared</span>
                        </div>
                        <div>
                            <Star size={20} />
                            <span>Quality Ingredients</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900"
                        alt="Delicious restaurant food"
                    />
                </div>
            </section>

            <section className="categories-section">
                <div className="section-heading">
                    <div>
                        <span className="section-tag">EXPLORE</span>
                        <h2>Food Categories</h2>
                    </div>

                    <Link to="/menu" className="view-link">
                        View Menu <ArrowRight size={17} />
                    </Link>
                </div>

                <div className="category-list">
                    {categories.filter(category => category.isActive !== false).map(category => (
                        <Link
                            to="/menu"
                            className="category-card"
                            key={category._id}
                        >
                            <h3>{category.name}</h3>
                            <p>{category.description || 'Explore delicious food'}</p>
                        </Link>
                    ))}

                    {!loading && categories.length === 0 && (
                        <p className="empty-message">No categories available yet.</p>
                    )}
                </div>
            </section>

            <section className="popular-section">
                <div className="section-heading">
                    <div>
                        <span className="section-tag">OUR SELECTION</span>
                        <h2>Popular Dishes</h2>
                    </div>

                    <Link to="/menu" className="view-link">
                        See All Foods <ArrowRight size={17} />
                    </Link>
                </div>

                {loading ? (
                    <p className="loading-message">Loading delicious food...</p>
                ) : foods.filter(food => food.isAvailable !== false).length > 0 ? (
                    <div className="food-grid">
                        {foods
                            .filter(food => food.isAvailable !== false)
                            .slice(0, 4)
                            .map(food => (
                                <div className="food-card" key={food._id}>
                                    <div className="food-image">
                                        <img
                                            src={
                                                food.image?.url ||
                                                'https://placehold.co/500x350?text=Food'
                                            }
                                            alt={food.name}
                                        />
                                    </div>

                                    <div className="food-info">
                                        <span className="food-category">
                                            {food.category?.name || 'Delicious Food'}
                                        </span>

                                        <h3>{food.name}</h3>

                                        <p>
                                            {food.description || 'Freshly prepared for you.'}
                                        </p>

                                        <div className="food-bottom">
                                            <strong>Rs. {food.price}</strong>
                                            <Link to="/menu">View Menu</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="empty-message">
                        No food items available yet. Please check back soon.
                    </p>
                )}
            </section>

        </main>
    );
}

export default Home;