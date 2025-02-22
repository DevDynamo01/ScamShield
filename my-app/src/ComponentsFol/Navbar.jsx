import React, { useContext } from "react";
import "./HomePage.css";
import { FirebaseContext } from "../ContextFol/FirebaseProvider";

const Navbar = () => {
  const { logout } = useContext(FirebaseContext);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">ScamShield</div>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/features">Features</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <div onClick={logout} className="userProf">
              SS
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
