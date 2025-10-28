


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

      <Header currentUser={currentUser} onLogout={handleLogout} />

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

      </Routes>

    </Router>

  );

}



export default App;
