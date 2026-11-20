import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, LogIn } from 'lucide-react';
import api from '../services/api';
import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/users/login', {
                email: formData.email.trim(),
                password: formData.password
            });

            const user = response.data.user;

            if (!['admin', 'superadmin'].includes(user.role)) {
                await api.post('/users/logout');

                setError('Access denied. Admin account required.');
                setLoading(false);
                return;
            }

            navigate('/admin/orders');

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-icon">
                    <LockKeyhole size={30} />
                </div>

                <h1>Admin Login</h1>

                <p className="login-subtitle">
                    Sign in to manage MyRestaurant
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="login-input-group">
                        <label>Email Address</label>

                        <div className="login-input">
                            <Mail size={19} />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label>Password</label>

                        <div className="login-input">
                            <LockKeyhole size={19} />

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        <LogIn size={19} />

                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                </form>

                <Link to="/" className="login-back">
                    Back to Homepage
                </Link>

            </div>
        </div>
    );
}

export default Login;