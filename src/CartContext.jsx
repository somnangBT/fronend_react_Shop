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

const ALLOWED_PROMOS = {
    KHMER10: 10,
    DELICIOUS20: 20,
    WELCOME15: 15,
};

export const CartProvider = ({ children }) => {
    const initialCart = loadSavedCartState();
    const [cartItems, setCartItems] = useState(() => initialCart?.cartItems || []);
    const [taxes, setTaxes] = useState(() => initialCart?.taxes || 0);
    const [shipping, setShipping] = useState(() => initialCart?.shipping || 0);
    const [promoCode, setPromoCode] = useState(() => initialCart?.promoCode || '');

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const subtotal = cartItems.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount ?? 0) / 100);
        return sum + discountedPrice * item.quantity;
    }, 0);

    const normalizedPromo = promoCode.trim().toUpperCase();
    const promoPercent = ALLOWED_PROMOS[normalizedPromo] || 0;
    const discount = promoPercent > 0 ? Number((subtotal * (promoPercent / 100)).toFixed(2)) : 0;

    useEffect(() => {
        try {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify({ cartItems, taxes, shipping, discount, promoCode: normalizedPromo })
            );
        } catch (_) {}
    }, [cartItems, taxes, shipping, discount, normalizedPromo]);

    const applyPromoCode = (code) => {
        const upper = String(code || '').trim().toUpperCase();
        if (ALLOWED_PROMOS[upper]) {
            setPromoCode(upper);
            return { valid: true, percent: ALLOWED_PROMOS[upper], code: upper };
        }
        setPromoCode('');
        return { valid: false, percent: 0, code: '' };
    };

    const total = Math.max(0, subtotal + taxes + shipping - discount);

    const addToCart = (product, quantity = 1) => {
        // Adding items clears any previous completed-order screen snapshot so new checkout starts fresh
        try {
            sessionStorage.removeItem('luckshop_checkout_completed_v1');
        } catch (_) {}

        const maxQty = typeof product.qty === 'number' && product.qty > 0 ? product.qty : Infinity;

        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.pro_id);
            if (existing) {
                const nextQty = Math.min(maxQty, existing.quantity + quantity);
                return prev.map((item) =>
                    item.id === product.pro_id
                        ? { ...item, quantity: nextQty, maxQty: maxQty === Infinity ? item.maxQty : maxQty }
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
                    maxQty: maxQty === Infinity ? undefined : maxQty,
                    quantity: Math.min(maxQty, Math.max(1, quantity)),
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
            prev.map((item) => {
                if (item.id !== itemId) return item;
                const cap = typeof item.maxQty === 'number' ? item.maxQty : Infinity;
                return { ...item, quantity: Math.min(cap, quantity) };
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setPromoCode('');
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
        promoPercent,
        promoCode: normalizedPromo,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        setTaxes,
        setShipping,
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