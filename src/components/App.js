import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import ProductDetail from "./productDetail";
import Cart from "./cart";
import { CartProvider } from "./CartContext";
import SearchResults from "./searchResult";
import Auth from "./auth";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import SuccessPage from "./success"; // Ensure correct import

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  if (loading) return <p>Loading...</p>; 
 return (
    <Router>
      <CartProvider>
        {user && <Header />} 
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/home" /> : <Auth />} />
          <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/auth" />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/product/:id" element={user ? <ProductDetail /> : <Navigate to="/auth" />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/auth" />} />
          <Route path="/search" element={user ? <SearchResults /> : <Navigate to="/auth" />} />
          <Route path="/success" element={user ? <SuccessPage /> : <Navigate to="/auth" />} /> 
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;
