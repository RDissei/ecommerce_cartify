import React, { useState, useEffect } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { auth } from "./firebase"; // Import Firebase Auth

function Header() {
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // State for user
  const navigate = useNavigate();

  // Listen for authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser); // User is logged in
      } else {
        setUser(null); // No user logged in
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle search navigation
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    auth.signOut();
    navigate("/auth"); // Redirect to login page after logout
  };

  return (
    <div className="header">
      {/* Logo navigates to home only if user is logged in */}
      <div className="header__logoLink" onClick={() => user && navigate("/home")}>
        <img className="header__logo" src="/logo.png" alt="logo" />
      </div>

      <div className="header__search">
        <input
          className="header__searchInput"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <SearchIcon className="header__searchIcon" onClick={handleSearch} />
      </div>

      <div className="header__nav">
        {/* Show username if logged in, else show "Guest" */}
        <div className="header__option" onClick={() => !user && navigate("/auth")}>
          <span className="header__optionLineOne">Hello, {user ? user.displayName || "User" : "Guest"}</span>
          {user ? (
            <span className="header__optionLineTwo" onClick={handleLogout}>Logout</span>
          ) : (
            <span className="header__optionLineTwo">Sign In</span>
          )}
        </div>

        <div className="header__option">
          <span className="header__optionLineOne">Return</span>
          <span className="header__optionLineTwo">& Orders</span>
        </div>

        <div className="header__option">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo">Prime</span>
        </div>

        <Link to="/cart" className="header__optionBasket">
          <ShoppingBasketIcon />
          <span className="header__optionLineTwo header__basketCount">{cart.length}</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
