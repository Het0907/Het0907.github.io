import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Phone, Mail, MapPin, Trash2 } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <img src="/logo.png" alt="Jay Traders Logo" className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Jay Traders
                </h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link to="/contactus" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                Contact Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link to="/engineering-hardware" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group">
                Engineering Hardware
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <div className="relative">
                <Link to="/cart" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group flex items-center">
                  <ShoppingBag className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse">{cart.length}</span>
                </Link>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">Home</Link>
              <Link to="/contactus" className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">Contact Us</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">About Us</Link>
              <Link to="/engineering-hardware" className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">Engineering Hardware</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart</h1>
            <p className="text-lg text-gray-600">Review and manage your selected items</p>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link 
                to="/welding-rod" 
                className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-[1.02] font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.brand}</h3>
                          <p className="text-gray-600">Size: {item.size}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">Quantity:</span>
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-16 text-center border-0 focus:ring-0 bg-transparent"
                            />
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="text-lg font-semibold text-gray-900">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Unique Items:</span>
                      <span className="text-lg font-semibold text-gray-900">{cart.length}</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-[1.02] font-medium">
                    Proceed to Checkout
                  </button>
                  <Link 
                    to="/welding-rod" 
                    className="block w-full text-center mt-4 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <img src="/logo.png" alt="Jay Traders Logo" className="h-10 w-10 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Jay Traders</h3>
                  <p className="text-gray-400 text-sm">Industrial Excellence</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">Leading supplier of premium industrial materials, serving businesses across India with quality, reliability, and innovation.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <div className="space-y-3">
                <Link to="/" className="block text-gray-400 hover:text-red-400 transition-colors">Home</Link>
                <Link to="/engineering-hardware" className="block text-gray-400 hover:text-red-400 transition-colors">Engineering Hardware</Link>
                <Link to="/contactus" className="block text-gray-400 hover:text-red-400 transition-colors">Contact Us</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-left">Contact Info</h4>
              <div className="space-y-3 text-left">
                <p className="flex items-start text-gray-400">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-red-400" />
                  <span>
                    303/1/2 Makarpura GIDC <br />
                    Near BSNL telephone exchange <br />
                    Vadodara, Gujarat, India
                  </span>
                </p>
                <p className="flex items-start text-gray-400">
                  <Phone className="h-4 w-4 mr-2 text-red-400" />
                  <span>
                    +91-9925031497 <br />
                    +91-9904301497
                  </span>
                </p>
                <p className="flex items-start text-gray-400">
                  <Mail className="h-4 w-4 mr-2 text-red-400" />
                  <span>jaytraders2008@yahoo.com</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 Jay Traders. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-gray-400 hover:text-red-400 transition-colors">Terms of Service</Link>
              <Link to="#" className="text-gray-400 hover:text-red-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 