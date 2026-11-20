import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();

    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-logo">
                    My<span>Restaurant</span>.
                </Link>

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/menu" onClick={() => setMenuOpen(false)}>Menu</NavLink>
                    <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
                    <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
                </nav>

                <div className="navbar-actions">

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Switch theme"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <Link to="/cart" className="cart-button">
                        <ShoppingBag size={19} />
                        <span>Cart</span>

                        {cartCount > 0 && (
                            <span className="cart-count">{cartCount}</span>
                        )}
                    </Link>

                    <Link to="/login" className="login-button">
                        Login
                    </Link>

                </div>
            </div>
        </header>
    );
}

export default Navbar;