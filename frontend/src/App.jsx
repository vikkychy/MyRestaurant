import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import FoodDetails from './Pages/FoodDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderConfirmation from './Pages/OrderConfirmation';
import Login from './Pages/Login';

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<div />} />
                <Route path="/contact" element={<div />} />
                <Route path="/food/:id" element={<FoodDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;