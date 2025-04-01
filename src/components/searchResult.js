import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../sanity/sanityClient';
import { urlFor } from '../sanity/sanityClient';
import './searchResult.css';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.toLowerCase() || '';

  useEffect(() => {
    client
      .fetch('*[_type == "product"]') // Fetch all products from Sanity
      .then((data) => {
        const filteredProducts = data.filter((product) =>
          product.name.toLowerCase().includes(query) // Match search query
        );
        setProducts(filteredProducts);
      })
      .catch(console.error);
  }, [query]);

  return (
    <div className="search-results">
      <h2>Search Results for: "{query}"</h2>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="search-grid">
          {products.map((product) => (
            <div key={product._id} className="search-item">
              <img src={urlFor(product.image[0]).width(200).url()} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
