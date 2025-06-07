import React from 'react';
import { useCart } from './context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <FaShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
                    <p className="mt-2 text-gray-600">Add some items to your cart to continue shopping.</p>
                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FaArrowLeft className="mr-2" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {cart.map((item) => (
                                <div key={`${item.productId}-${item.variant.size}`} className="p-6">
                                    <div className="flex items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <div className="ml-6 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Size: {item.variant.size}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <label htmlFor={`quantity-${item.productId}`} className="mr-2 text-sm text-gray-600">
                                                        Quantity:
                                                    </label>
                                                    <select
                                                        id={`quantity-${item.productId}`}
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.productId, item.variant.size, parseInt(e.target.value))}
                                                        className="rounded-md border-gray-300 text-sm"
                                                    >
                                                        {[...Array(item.variant.stock)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>
                                                                {i + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId, item.variant.size)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900 font-semibold">
                                    ₹{getCartTotal().toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-gray-900 font-semibold">Free</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ₹{getCartTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    // TODO: Implement checkout
                                    console.log('Proceeding to checkout');
                                }}
                                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 