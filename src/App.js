import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './about';
import ContactUs from './contactus';
import IndustrialHomepage from './IndustrialHomepage';
import Cart from './cart';
import AdminDashboard from './AdminDashboard';
import ListProducts from './admin/ListProducts';
import EditItems from './admin/EditItems';
import AddItems from './admin/AddItems';
import RemoveItems from './admin/RemoveItems';
import { CartProvider } from './context/CartContext';
import CategoryPage from './CategoryPage';
import CategoryProducts from './CategoryProducts';
import ProductDetail from './ProductDetail';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<IndustrialHomepage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/industrial" element={<IndustrialHomepage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/list" element={<ListProducts />} />
              <Route path="/admin/edit" element={<EditItems />} />
              <Route path="/admin/add" element={<AddItems />} />
              <Route path="/admin/remove" element={<RemoveItems />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryProducts />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;