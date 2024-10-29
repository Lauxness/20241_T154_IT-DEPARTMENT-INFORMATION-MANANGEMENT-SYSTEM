import React from "react";

import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        <h2>Contact</h2>
        <p>Facing any problems?</p>
      </div>
      <ul className={styles.links}>
        <li className={styles.link}>
          <img src={getImageUrl("contact/emailIcon.png")} alt="Email icon" />
          <a href="support@unscathed.com">support@unscathed.com</a>
        </li>
        <li className={styles.link}>
          <img
            src={getImageUrl("contact/facebook.png")}
            alt="LinkedIn icon"
          />
          <a href="https://www.facebook.com/Unscathed">facebook.com/Unscathed</a>
        </li>
        <li className={styles.link}>
          <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" />
          <a href="https://www.github.com/UnscathedITSolutions">github.com/UnscathedITSolutions</a>
        </li>
      </ul>
    </footer>
  );
};
