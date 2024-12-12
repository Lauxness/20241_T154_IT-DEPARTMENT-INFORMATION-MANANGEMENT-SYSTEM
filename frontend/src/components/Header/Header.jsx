import { useState } from "react";
import BukSuLogo from "../../assets/BukSuLogo.png";
import COTLogo from "../../assets/COTLogo.png";

import style from "./style.module.css";

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
      <div className={style.heading}>
        <div className={style.projectName}>
          <img src={COTLogo} alt="COT logo" />
          <p>IT DEPARTMENT INFORMATION MANAGEMENT SYSTEM</p>
        </div>
      </div>
    </>
  );
}
export default Header;
