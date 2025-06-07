import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { cart } = useCart();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="flex items-center mr-4">
                                <div className="relative">
                                    <img src="/logo.png" alt="Jay Traders Logo" className="h-12 w-12" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                    Jay Traders
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                            About Us
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                            Contact Us
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
                        </Link>

                        {/* Product Category Dropdown */}
                        <div className="relative">
                            <button 
                                className="flex items-center text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 group"
                                onClick={toggleDropdown}
                            >
                                Product Categories
                                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 animate-fade-in">
                                    <div className="py-2">
                                        <Link to="/category/engineering-hardware" className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group" onClick={() => setIsDropdownOpen(false)}>
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                                            Engineering Hardware
                                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                        <Link to="/category/pharma-materials" className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group" onClick={() => setIsDropdownOpen(false)}>
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                                            Pharma Materials
                                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                        <Link to="/category/ibr-materials" className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group" onClick={() => setIsDropdownOpen(false)}>
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                                            IBR Materials
                                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <Link to="/cart" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group flex items-center">
                                <ShoppingBag className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse">{cart.length}</span>
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-red-600 transition-colors"
                                onClick={toggleMenu}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-red-600 transition-colors"
                                onClick={toggleMenu}
                            >
                                About Us
                            </Link>
                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-red-600 transition-colors"
                                onClick={toggleMenu}
                            >
                                Contact
                            </Link>
                            <div className="py-2">
                                <button 
                                    className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={toggleDropdown}
                                >
                                    <span>Product Categories</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="pl-6 mt-2 space-y-1">
                                        <Link to="/category/engineering-hardware" className="block py-2 text-gray-600 hover:text-red-600 transition-colors" onClick={() => { setIsDropdownOpen(false); setIsMenuOpen(false); }}>Engineering Hardware</Link>
                                        <Link to="/category/pharma-materials" className="block py-2 text-gray-600 hover:text-red-600 transition-colors" onClick={() => { setIsDropdownOpen(false); setIsMenuOpen(false); }}>Pharma Materials</Link>
                                        <Link to="/category/ibr-materials" className="block py-2 text-gray-600 hover:text-red-600 transition-colors" onClick={() => { setIsDropdownOpen(false); setIsMenuOpen(false); }}>IBR Materials</Link>
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/cart"
                                className="text-gray-700 hover:text-red-600 transition-colors"
                                onClick={toggleMenu}
                            >
                                Cart ({cart.length})
                            </Link>
                        </div>
                    </nav>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                
                .animate-slide-down {
                    animation: slide-down 0.2s ease-out;
                }
            `}</style>
        </header>
    );
};

export default Navbar; 