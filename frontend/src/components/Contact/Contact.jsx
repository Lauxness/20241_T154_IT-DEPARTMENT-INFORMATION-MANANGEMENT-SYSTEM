import React from "react";

import styles from "./Contact.module.css";
import emailIcon from "../../assets/contact/emailIcon.png";
import facebook from "../../assets/contact/facebook.png";
import githubIcon from "../../assets/contact/githubIcon.png";
import { getImageUrl } from "../../utils";
const size = {
  width: "40px",
  height: "40px",
};
export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        <h2>Contact</h2>
        <p>Facing any problems?</p>
      </div>
      <ul className={styles.links}>
        <li className={styles.link}>
          <img src={emailIcon} alt="Email icon" style={size} />
          <a href="support@unscathed.com">support@unscathed.com</a>
        </li>
        <li className={styles.link}>
          <img src={facebook} alt="LinkedIn icon" style={size} />
          <a href="https://www.facebook.com/Unscathed">
            facebook.com/Unscathed
          </a>
        </li>
        <li className={styles.link}>
          <img src={githubIcon} alt="Github icon" style={size} />
          <a href="https://www.github.com/UnscathedITSolutions">
            github.com/UnscathedITSolutions
          </a>
        </li>
      </ul>
    </footer>
  );
};
