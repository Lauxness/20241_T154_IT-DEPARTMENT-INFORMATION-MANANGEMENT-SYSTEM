import React from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";
import image from "../../../assets/Wave.png";

export const Hero = () => {
  return (
    <section className={styles.container} id="hero">
      <img className="wave" src={image} alt="" />
      <div className={styles.content}>
        <h1 className={styles.title}>
        <div className="title">
              <p>
                A <span>centralized database</span> for students information in
                Bukidnon State University IT Department
              </p>
            </div>
        </h1>
        <p className={styles.description}>
          Our comprehensive solution to help enrollment officers organize
          student data and track student requirements seamlessly.
        </p>
        <a href="" className={styles.startBtn}>
          GET STARTED
        </a>
      </div>
      
      <img
        src={getImageUrl("hero/heroImage.png")}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
