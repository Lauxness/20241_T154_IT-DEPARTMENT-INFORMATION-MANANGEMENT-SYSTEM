import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

import Swal from "sweetalert2";
import OvalLoader from "../loader/OvalLoader";
import { addNewSemester, editSemester } from "../../api";

function SemesterModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [schoolyear, setSchoolYear] = useState();
  const [semester, setSemester] = useState();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (props.trigger && props.semester && props.semester.length > 0) {
      const firstSemester = props.semester[0];
      if (firstSemester) {
        setSchoolYear(firstSemester.schoolYear.split("-")[0] || "");
        setSemester(firstSemester.semester || "");
      }
    } else {
      setSchoolYear("");
      setSemester("");
    }
  }, [props.trigger]);
  const years = [];
  for (let year = currentYear; year < currentYear + 11; year++) {
    years.push(year);
  }
  const handleClose = () => {
    props.editSemester("");
    props.setTrigger(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSemester = { semester, schoolyear };
    if (props.semester?.length > 0) {
      try {
        console.log(props.semester[0]._id);
        const response = await editSemester(props.semester[0]._id, newSemester);
        if (response.status === 200) {
          Swal.fire("Success", "Semester successfuly updated!", "success").then(
            () => {
              window.location.reload();
            }
          );
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 409) {
          Swal.fire("", error.response.data.message, "error");
        }
      }
    } else {
      try {
        const response = await addNewSemester(newSemester);
        if (response.status === 201) {
          Swal.fire("Success", "New Semester Added", "success").then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 409) {
          Swal.fire("", error.response.data.message, "error");
        }
      }
    }
  };
  return props.trigger ? (
    <div className={styles.popUpContainer}>
      <div className={styles.popUpInner}>
        <div className={styles.header}>
          <p className={styles.title}>
            {props.semester?.length > 0 ? "Edit Semester" : "Add Semester"}
          </p>
          <button
            className={styles.closeButton}
            onClick={(e) => handleClose(e)}
          >
            Close
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="year">
              Select Start Year:
            </label>
            <select
              className={styles.input}
              id="year"
              value={schoolyear}
              required
              onChange={(e) => setSchoolYear(e.target.value)}
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Semester: </label>
            <select
              className={styles.input}
              value={semester}
              required
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select semester</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
            </select>
          </div>

          <button className={styles.submitButton} type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  ) : (
    ""
  );
}

export default SemesterModal;
