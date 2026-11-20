import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('myrestaurant-cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('myrestaurant-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add food to cart
    const addToCart = (food, quantity = 1) => {
        setCartItems(currentItems => {
            const existingItem = currentItems.find(
                item => item._id === food._id
            );

            if (existingItem) {
                return currentItems.map(item =>
                    item._id === food._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    _id: food._id,
                    name: food.name,
                    price: food.price,
                    image: food.image?.url || '',
                    category: food.category?.name || 'Our Food',
                    quantity
                }
            ];
        });
    };

    // Update food quantity
    const updateQuantity = (foodId, quantity) => {
        if (quantity < 1) return;

        setCartItems(currentItems =>
            currentItems.map(item =>
                item._id === foodId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Remove food from cart
    const removeFromCart = foodId => {
        setCartItems(currentItems =>
            currentItems.filter(item => item._id !== foodId)
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used inside CartProvider');
    }

    return context;
}