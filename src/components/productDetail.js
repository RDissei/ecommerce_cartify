import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { client } from "../sanity/sanityClient";
import { urlFor } from "../sanity/sanityClient";
import "./productDetail.css";
import { useCart } from "./CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]); 
  const [quantity, setQuantity] = useState(1); 
  const [totalPrice, setTotalPrice] = useState(0);
  const { addToCart } = useCart();

 
  useEffect(() => {
    client
      .fetch(`*[_type == "product" && _id == $id][0]`, { id })
      .then((data) => {
        setProduct(data);
        if (data?.category) {
          fetchRecommendedProducts(data.category, data._id);
        }
      })
      .catch(console.error);
  }, [id]);

  const fetchRecommendedProducts = (category, currentProductId) => {
    client
      .fetch(
        `*[_type == "product" && category == $category && _id != $currentProductId][0..3]`,
        { category, currentProductId }
      )
      .then((data) => setRecommended(data))
      .catch(console.error);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  useEffect(() => {
    if (product) {
      const price = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;
      setTotalPrice(price * quantity);
    }
  }, [product, quantity]);

  if (!product) return <p>Loading product details...</p>;

  const formattedTotalPrice = totalPrice.toFixed(2);

  const handleBuyNow = async () => {
    try {
      const response = await fetch("http://localhost:4242/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: [
            {
              id: product._id,
              name: product.name,
              price: Math.round(totalPrice * 100), 
              image: product.image?.length > 0 ? urlFor(product.image[0]).url() : "",
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
  
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <div className="product-detail-container">
      <div className="product-main">
        {product.image && product.image.length > 0 && (
          <img
            src={urlFor(product.image[0]).width(500).url()}
            alt={product.name}
            className="product-detail-image"
          />
        )}
        <div className="product-detail-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-price">
            <span className="final-price">₹{formattedTotalPrice}</span>
            {product.discount > 0 && (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="product-discount">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max="100"
              className="quantity-input"
            />
          </div>

          <div className="product-actions">
            <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

=      {recommended.length > 0 && (
        <div className="recommended-products">
          <h2>Recommended Products</h2>
          <div className="recommended-grid">
            {recommended.map((item) => (
              <div
                key={item._id}
                className="recommended-item"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {item.image?.length > 0 && (
                  <img
                    src={urlFor(item.image[0]).width(150).url()}
                    alt={item.name}
                    className="recommended-image"
                  />
                )}
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

