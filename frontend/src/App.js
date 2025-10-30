


import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import authService from './services/authService';

import Header from './components/Header';

import Home from './pages/Home';

import Login from './pages/Login';

import Register from './pages/Register';

import Men from './pages/Men';

import Women from './pages/Women';
import Accessories from './pages/Accessories';

import Cart from './pages/Cart';

import Checkout from './pages/Checkout';

import Admin from './pages/Admin';

import AdminRoute from './components/AdminRoute';



import Search from './pages/Search';



import Footer from './components/Footer';
import './App.css';

function App() {

  const [currentUser, setCurrentUser] = useState(undefined);



  useEffect(() => {

    const user = authService.getCurrentUser();

    if (user) {

      setCurrentUser(user);

    }

  }, []);



  const handleLogin = () => {

    setCurrentUser(authService.getCurrentUser());

  };



  const handleLogout = () => {

    authService.logout();

    setCurrentUser(undefined);

  };



  return (

    <Router>
      <div className="app-container">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>

        <Route path="/" element={<Accessories />} />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route path="/register" element={<Register />} />

        <Route path="/men" element={<Men />} />

        <Route path="/women" element={<Women />} />
        <Route path="/accessories" element={<Accessories />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        <Route path="/search" element={<Search />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>

  );

}



export default App;
