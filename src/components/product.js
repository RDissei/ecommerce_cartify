import React, { useEffect, useState } from "react";
import { client } from "../sanity/sanityClient";
import { urlFor } from "../sanity/sanityClient";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { motion } from "framer-motion"; 
import "./product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
 useEffect(() => {
    client
      .fetch(`*[_type == "product"][0...6]`)
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);
return (
    <div className="product-container">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product, index) => {
          const discountAmount = product.discount
            ? (product.price * product.discount) / 100
            : 0;
          const finalPrice = product.price - discountAmount;

          return (
            <motion.div
              key={product._id}
              className="product-card"
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.1 }} 
              whileHover={{ scale: 1.05 }} 
            >
               <Link to={`/product/${product._id}`} className="product-link">
                <div className="image-container">
                  {product.image && product.image.length > 0 ? (
                    <motion.img
                      src={urlFor(product.image[0]).width(300).url()}
                      alt={product.name}
                      className="product-image"
                      whileHover={{ scale: 1.1 }} 
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    <span className="final-price">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    <span className="original-price">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="product-discount">
                        ({product.discount}% OFF)
                      </span>
                    )}
                  </p>
                </div>
              </Link>
              <motion.button
                className="buy-button"
                onClick={() => addToCart(product)}
                whileTap={{ scale: 0.9 }} 
              >
                Add to Cart
              </motion.button>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default Product;
