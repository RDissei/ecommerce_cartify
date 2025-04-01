import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessPage.css";

const Success = () => {
  const [orderId, setOrderId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderId = localStorage.getItem("orderId");
    const storedTotalAmount = localStorage.getItem("totalAmount");

    // Check if orderId and totalAmount are available in localStorage
    if (storedOrderId && storedTotalAmount) {
      setOrderId(storedOrderId);
      setTotalAmount(parseFloat(storedTotalAmount).toFixed(2)); // Ensure amount is formatted correctly
    } else {
      // Redirect to home if no data is found in localStorage
      navigate("/");
    }
  }, [navigate]);

  if (!orderId || !totalAmount) {
    return <p>Loading...</p>; // Loading state in case data isn't ready yet
  }

  return (
    <div className="success-container">
      <h2>Payment Successful!</h2>
      
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default Success;
