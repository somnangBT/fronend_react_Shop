import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [taxes, setTaxes] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [promoCode, setPromoCode] = useState('');

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const subtotal = cartItems.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount ?? 0) / 100);
        return sum + discountedPrice * item.quantity;
    }, 0);

    const total = subtotal + taxes + shipping - discount;

    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.pro_id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.pro_id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: product.pro_id,
                    name: product.pro_name,
                    price: parseFloat(product.price),
                    image: product.image,
                    discount: product.discount || 0,
                    quantity,
                },
            ];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setPromoCode('');
        setDiscount(0);
    };

    const value = {
        cartItems,
        cartCount,
        subtotal,
        taxes,
        shipping,
        discount,
        total,
        promoCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setTaxes,
        setShipping,
        setDiscount,
        setPromoCode,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;