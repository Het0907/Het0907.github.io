import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import IndustrialHomepage from "./IndustrialHomepage";
import EngineeringHardwarePage from "./engineering";
import WeldingRodBrands from "./welding_rod";
import AboutUs from "./about";
import ContactUs from "./contactus";
import Cart from "./cart";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/" element={<Navigate to="/industrial-homepage" replace />} />
        <Route path="/industrial-homepage" element={<IndustrialHomepage />} />
        <Route path="/engineering-hardware" element={<EngineeringHardwarePage />} />
        <Route path="/welding-rods" element={<WeldingRodBrands />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;