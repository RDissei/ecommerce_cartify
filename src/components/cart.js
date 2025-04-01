
import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { urlFor } from "../sanity/sanityClient";
import { useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0); 

  
  useEffect(() => {
    calculateTotalAmount(cart); 
  }, [cart]);

  const calculateTotalAmount = (cartItems) => {
    const amount = cartItems.reduce((total, item) => {
      const discountedPrice = item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price;
      return total + discountedPrice * item.quantity;
    }, 0);
    setTotalAmount(amount); 
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity); 
  };

  const handleCheckout = async () => {
    await processCheckout(cart); 
  };

  
  const handleCheckoutSingle = async (product) => {
    await processCheckout([product]);
  };

  const processCheckout = async (cartItems) => {
    try {
      const totalAmountInCents = Math.round(totalAmount * 100); 

      const response = await fetch("http://localhost:4242/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cartItems.map((item) => ({
            name: item.name,
            price: Math.round(
              (item.discount
                ? item.price - (item.price * item.discount) / 100
                : item.price) * 100  
            ),
            image: item.image ? item.image[0].asset.url : "",
            quantity: item.quantity,
          })),
          totalAmount: totalAmountInCents, 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url, orderId } = await response.json();
      localStorage.setItem("orderId", orderId);
      window.location.href = url; 
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.map((product, index) => {
        const discountedPrice = product.discount
          ? product.price - (product.price * product.discount) / 100
          : product.price;

        return (
          <div key={index} className="cart-item">
            {product.image && Array.isArray(product.image) && product.image.length > 0 ? (
              <img
                src={urlFor(product.image[0]).width(100).url()}
                alt={product.name}
                className="cart-item-image"
              />
            ) : (
              <p>No Image Available</p>
            )}
            <div className="cart-item-info">
              <h3>{product.name}</h3>
              <p>
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  ₹{product.price}
                </span>{" "}
                <strong>₹{discountedPrice.toFixed(2)}</strong>
              </p>
              {product.discount && <p>Discount: {product.discount}%</p>}

              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                  disabled={product.quantity <= 1}
                  className="quantity-button"
                >
                  -
                </button>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleQuantityChange(product._id, parseInt(e.target.value))
                  }
                  className="quantity-input"
                  min="1"
                />
                <button
                  onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
              </div>

              <button onClick={() => removeFromCart(product._id)} className="remove-button">
                Remove
              </button>

              <button className="buy-now-button" onClick={() => handleCheckoutSingle(product)}>
                Buy Now
              </button>
            </div>
          </div>
        );
      })}

      <div className="cart-summary">
        <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
