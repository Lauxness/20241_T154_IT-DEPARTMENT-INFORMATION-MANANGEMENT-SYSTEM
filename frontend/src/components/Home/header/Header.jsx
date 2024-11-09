import { useState } from "react";
import BukSuLogo from "../../../assets/BukSuLogo.png";
import COTLogo from "../../../assets/COTLogo.png";
import LoginModal from "../loginModal/LoginModal";
import "./style.css";

function Header() {
  const [trigger, setTrigger] = useState(false);
  const [navBar, setNavBar] = useState(false);
  const [dispayNavbar, setDisplayNavbar] = useState(false);
  const triggerLogin = () => {
    if (trigger) {
      setTrigger(false);
      console.log("closed");
    } else {
      setTrigger(true);
    }
  };
  const triggerDisplayNavBar = () => {
    if (dispayNavbar) {
      setDisplayNavbar(false);
    } else {
      setDisplayNavbar(true);
    }
  };
  const changeBackground = () => {
    if (window.scrollY >= 70) {
      setNavBar(true);
    } else {
      setNavBar(false);
    }
  };
  window.addEventListener("scroll", changeBackground);
  return (
    <>
      <div className={navBar ? "header active" : "header"}>
        <LoginModal trigger={trigger} triggerTask={triggerLogin} />
        <div className="project-name">
          <img src={BukSuLogo} alt="Buksu logo" />
          <img src={COTLogo} alt="COT logo" />
          <p>IT DEPARTMENT INFORMATION MANAGEMENT SYSTEM</p>
        </div>
        <div className="navbar">
          <div className="hamburger" onClick={triggerDisplayNavBar}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={dispayNavbar ? "nav-links open-navbar" : "nav-links"}>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#developers">Developers</a>
            <a href="#about">About</a>
          </div>
          <button
            className={dispayNavbar ? "display-button" : ""}
            onClick={() => triggerLogin()}
          >
            Login now
          </button>
        </div>
      </div>
    </>
  );
}
export default Header;
