import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    
    if (existingProductIndex !== -1) {
      setCartMessage("This product is already in your cart!"); 
    } else {
      setCart((prevCart) => {
        const updatedCart = [...prevCart, product]; 
        return updatedCart;
      });
      setCartMessage(""); 
    }
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item._id === id ? { ...item, quantity: quantity } : item
      );
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartMessage, calculateTotalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

