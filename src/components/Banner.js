import React, { useEffect, useState, useCallback } from 'react';
import { client } from '../sanity/sanityClient';
import { urlFor } from '../sanity/sanityClient';
import './Banner.css';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banners from Sanity
  useEffect(() => {
    client
      .fetch('*[_type == "banner"]') // Fetch banners from Sanity
      .then((data) => {
        console.log("Fetched Banners:", data); // Debugging log
        setBanners(data);
      })
      .catch((error) => console.error("Error fetching banners:", error));
  }, []);

  // Function to go to the next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners]);

  // Function to go to the previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  }, [banners]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(nextSlide, 4000);

    return () => clearInterval(interval);
  }, [banners, nextSlide]);

  if (banners.length === 0) return <p>Loading banners...</p>;

  return (
    <div className="banner-slider">
      <div className="banner-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner, index) => (
          <img
            key={index}
            src={urlFor(banner.image).width(1200).height(400).url()}
            alt={`Banner ${index + 1}`}
            className="banner-slide"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button className="prev-button" onClick={prevSlide}>❮</button>
      <button className="next-button" onClick={nextSlide}>❯</button>

      {/* Dots Indicator */}
      <div className="dots-container">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Banner;
