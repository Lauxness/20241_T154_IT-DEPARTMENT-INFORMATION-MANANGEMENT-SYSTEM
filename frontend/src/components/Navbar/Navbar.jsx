import React, { useState } from "react";
import styles from "./Navbar.module.css";
import BukSuLogo from "../../../assets/BukSuLogo.png";
import COTLogo from "../../../assets/COTLogo.png";
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={BukSuLogo} alt="Buksu logo" />
        <img src={COTLogo} alt="COT logo" />
        <p className={styles.systemText}>IT DEPARTMENT INFORMATION MANAGEMENT SYSTEM</p>
      </div>
      <div className={styles.menu}>
        <img
          className={styles.menuBtn}
          src={
            menuOpen
              ? getImageUrl("nav/closeIcon.png")
              : getImageUrl("nav/menuIcon.png")
          }
          alt="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <ul
          className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}
          onClick={() => setMenuOpen(false)}
        >
          <li><a href="#hero">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#developers">Developers</a></li>
          <li><a href="#about">About</a></li>
          <a href="" className={styles.loginBtn}>
          Login Now
        </a>
        </ul>
      </div>
    </nav>
  );
};
