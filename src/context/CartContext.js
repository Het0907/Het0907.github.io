import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(
                item => item.productId === action.payload.productId && 
                       item.variant.size === action.payload.variant.size
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.productId === action.payload.productId && 
                        item.variant.size === action.payload.variant.size
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                };
            }

            return {
                ...state,
                items: [...state.items, action.payload]
            };

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(
                    item => !(item.productId === action.payload.productId && 
                            item.variant.size === action.payload.variant.size)
                )
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.productId === action.payload.productId && 
                    item.variant.size === action.payload.variant.size
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: JSON.parse(localStorage.getItem('cart')) || []
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    const addToCart = (product, variant, quantity) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                productId: product._id,
                name: product.name,
                image: product.image,
                price: variant.price,
                variant: {
                    size: variant.size,
                    stock: variant.stock
                },
                quantity
            }
        });
    };

    const removeFromCart = (productId, variantSize) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: { productId, variantSize }
        });
    };

    const updateQuantity = (productId, variantSize, quantity) => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { productId, variantSize, quantity }
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return state.items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart: state.items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount
            }}
        >
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