import { useEffect, useMemo, useState } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import api from '../services/api';
import './Menu.css';
import { Link } from 'react-router-dom';

function Menu() {
const [foods, setFoods] = useState([]);
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('all');
const [searchTerm, setSearchTerm] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
useEffect(() => {
    const fetchMenu = async () => {
        try {
            setLoading(true);
            setError('');

            const [foodResponse, categoryResponse] = await Promise.all([
                api.get('/foods'),
                api.get('/categories')
            ]);

            setFoods(foodResponse.data.foods || []);
            setCategories(categoryResponse.data.categories || []);
        } catch (err) {
            console.error('Menu loading error:', err);
            setError('Unable to load the menu. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    fetchMenu();
}, []);

const filteredFoods = useMemo(() => {
    return foods.filter(food => {
        const matchesCategory =
            selectedCategory === 'all' ||
            food.category?._id === selectedCategory ||
            food.category === selectedCategory;

        const matchesSearch = food.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        return food.isAvailable && matchesCategory && matchesSearch;
    });
}, [foods, selectedCategory, searchTerm]);

return (
    <main className="menu-page">
        <section className="menu-header">
            <span className="menu-subtitle">OUR FOOD COLLECTION</span>
            <h1>Explore Our Menu</h1>
            <p>Discover delicious food prepared with fresh ingredients.</p>
        </section>

        <section className="menu-controls">
            <div className="menu-search">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search your favourite food..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="menu-categories">
                <button
                    className={selectedCategory === 'all' ? 'active' : ''}
                    onClick={() => setSelectedCategory('all')}
                >
                    All Foods
                </button>

                {categories
                    .filter(category => category.isActive)
                    .map(category => (
                        <button
                            key={category._id}
                            className={
                                selectedCategory === category._id ? 'active' : ''
                            }
                            onClick={() => setSelectedCategory(category._id)}
                        >
                            {category.name}
                        </button>
                    ))}
            </div>
        </section>

        <section className="menu-food-section">
            {loading ? (
                <div className="menu-message">Loading menu...</div>
            ) : error ? (
                <div className="menu-message error">{error}</div>
            ) : filteredFoods.length === 0 ? (
                <div className="menu-empty">
                    <UtensilsCrossed size={42} />
                    <h3>No food items found</h3>
                    <p>Try another search or category.</p>
                </div>
            ) : (
                <div className="menu-food-grid">
                    {filteredFoods.map(food => (
                        <article className="menu-food-card" key={food._id}>
                            <div className="menu-food-image">
                                <img
                                    src={
                                        food.image?.url ||
                                        'https://placehold.co/600x400?text=Food+Image'
                                    }
                                    alt={food.name}
                                />
                            </div>

                            <div className="menu-food-info">
                                <span className="menu-food-category">
                                    {food.category?.name || 'Our Food'}
                                </span>

                                <h3>{food.name}</h3>

                                <p>{food.description}</p>
                                <Link to={`/food/${food._id}`} className="menu-details-link">
                                    View Details
                                </Link>

                                <div className="menu-food-bottom">
                                    <span className="menu-food-price">
                                        Rs. {food.price}
                                    </span>
                                    <span className="available-label">
                                        Available
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    </main>
);
}

export default Menu;