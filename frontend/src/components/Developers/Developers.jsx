import React from "react";

import styles from "./Developers.module.css";
import programs from "../../data/programs.json";
import devs from "../../data/devs.json";
import { getImageUrl } from "../../utils";

export const Developers = () => {
  return (
    <section className={styles.container} id="developers">
      <h2 className={styles.title}>The Developers</h2>
      <div className={styles.content}>
        <div className={styles.programs}>
          {programs.map((program, id) => {
            return (
              <div key={id} className={styles.program}>
                <div className={styles.programImageContainer}>
                  <img src={getImageUrl(program.imageSrc)} alt={program.title} />
                </div>
                <p>{program.title}</p>
              </div>
            );
          })}
        </div>
        <ul className={styles.devs}>
          {devs.map((devsItem, id) => {
            return (
              <li key={id} className={styles.devsItem}>
                <img
                  src={getImageUrl(devsItem.imageSrc)}
                  alt={`${devsItem.organisation} Logo`}
                />
                <div className={styles.devsItemDetails}>
                  <h3>{`${devsItem.name}, ${devsItem.organisation}`}</h3>
                  <p>{`${devsItem.role} - ${devsItem.role2}`}</p>
                  <ul>
                    {devsItem.description.map((experience, id) => {
                      return <li key={id}>{experience}</li>;
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
