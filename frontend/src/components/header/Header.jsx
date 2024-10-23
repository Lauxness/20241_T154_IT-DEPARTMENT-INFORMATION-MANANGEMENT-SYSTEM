import { useState } from "react";
import BukSuLogo from "../../assets/BukSuLogo.png";
import COTLogo from "../../assets/COTLogo.png";
import LoginModal from "../loginModal/LoginModal";
import "./style.css";

function Header() {
  const [trigger, setTrigger] = useState(false);
  const triggerLogin = () => {
    if (trigger) {
      setTrigger(false);
    } else {
      setTrigger(true);
    }
  };
  return (
    <>
      <LoginModal trigger={trigger} triggerTask={triggerLogin} />
      <div className="header">
        <div className="project-name">
          <img src={BukSuLogo} alt="Buksu logo" />
          <img src={COTLogo} alt="COT logo" />
          <p>IT DEPARTMENT INFORMATION MANAGEMENT SYSTEM</p>
        </div>
        <div className="navbar">
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Developers</a>
            <a href="#">FaQ</a>
          </div>
          <button onClick={triggerLogin}>Login now</button>
        </div>
      </div>
    </>
  );
}
export default Header;
