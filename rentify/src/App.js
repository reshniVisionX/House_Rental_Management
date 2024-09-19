import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';  
import './App.css'
import Home from './components/Home';
import Buyer from './components/Buyer';
import Seller from './components/Seller';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Register';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Cart from './components/Cart'
import Property from './components/Property';
import Booking from './components/Booking';
import MYBookings from './components/MYBookings';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoutes/>}>
            <Route path="/" element={<Home />} />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/cartProp" element={<Cart/>} />
            <Route path="/property/:id" element={<Property/>}/>
            <Route path="/booking" element={<Booking/>}/>
            <Route path="/mybookings" element={<MYBookings/>}/>
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
