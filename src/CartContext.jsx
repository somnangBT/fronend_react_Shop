import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'luckshop_cart_v1';

const loadSavedCartState = () => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
            cartItems: Array.isArray(parsed?.cartItems) ? parsed.cartItems : [],
            taxes: Number(parsed?.taxes) || 0,
            shipping: Number(parsed?.shipping) || 0,
            discount: Number(parsed?.discount) || 0,
            promoCode: typeof parsed?.promoCode === 'string' ? parsed.promoCode : '',
        };
    } catch (_) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return null;
    }
};

export const CartProvider = ({ children }) => {
    const initialCart = loadSavedCartState();
    const [cartItems, setCartItems] = useState(() => initialCart?.cartItems || []);
    const [taxes, setTaxes] = useState(() => initialCart?.taxes || 0);
    const [shipping, setShipping] = useState(() => initialCart?.shipping || 0);
    const [discount, setDiscount] = useState(() => initialCart?.discount || 0);
    const [promoCode, setPromoCode] = useState(() => initialCart?.promoCode || '');

    useEffect(() => {
        try {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify({ cartItems, taxes, shipping, discount, promoCode })
            );
        } catch (_) {}
    }, [cartItems, taxes, shipping, discount, promoCode]);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const subtotal = cartItems.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount ?? 0) / 100);
        return sum + discountedPrice * item.quantity;
    }, 0);

    const total = subtotal + taxes + shipping - discount;

    const addToCart = (product, quantity = 1) => {
        // Adding items clears any previous completed-order screen snapshot so new checkout starts fresh
        try {
            sessionStorage.removeItem('luckshop_checkout_completed_v1');
        } catch (_) {}

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
        setTaxes(0);
        setShipping(0);
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch (_) {}
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