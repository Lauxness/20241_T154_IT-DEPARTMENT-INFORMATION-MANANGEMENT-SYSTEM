import { useState } from "react";
import styles from "./style.module.css";
import { addStudent } from "../../api";
import Swal from "sweetalert2";
function Modal(props) {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [program, setProgram] = useState("");

  const handleStudentName = (e) => setStudentName(e.target.value);
  const handleStudentId = (e) => setStudentId(e.target.value);
  const handleYear = (e) => setYear(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhoneNumber = (e) => setPhoneNumber(e.target.value);
  const handleProgram = (e) => setProgram(e.target.value);

  const showSwal = (success, message) => {
    console.log(success);
    if (!success) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setStudentName("");
    setStudentId("");
    setYear("");
    setEmail("");
    setPhoneNumber("");
    setProgram("");
    const newStudent = {
      studentId,
      studentName,
      year,
      email,
      phoneNumber,
      program,
    };

    try {
      const response = await addStudent(newStudent);

      if (response.status === 201) {
        console.log("Student added successfully");

        props.triggerModal();
        showSwal(true, "Student Added Successfully");
      } else if (response.status === 409) {
        props.triggerModal();
        showSwal(false, "Student Already Exists");
      } else {
        showSwal(false, "Failed to add Student");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        props.triggerModal();
        showSwal(false, "Student Already Exists");
      } else {
        console.error("Failed to add student:", error);
        props.triggerModal();
        showSwal(false, "Failed to add Student");
      }
    }
  };

  return props.trigger ? (
    <div className={styles.popUpContainer}>
      <div className={styles.popUpInner}>
        <div className={styles.header}>
          <p className={styles.title}>Add Student</p>
          <button
            className={styles.closeButton}
            onClick={() => props.triggerModal()}
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Student ID: </label>
            <input
              type="text"
              required
              className={styles.input}
              value={studentId}
              onChange={handleStudentId}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Student Name: </label>
            <input
              type="text"
              required
              className={styles.input}
              value={studentName}
              onChange={handleStudentName}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address: </label>
            <input
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number: </label>
            <input
              type="tel"
              required
              className={styles.input}
              value={phoneNumber}
              onChange={handlePhoneNumber}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Program: </label>
            <select
              className={styles.input}
              value={program}
              onChange={handleProgram}
            >
              <option value="">Select program</option>
              <option value="BSIT">BSIT</option>
              <option value="BSEMC">BSEMC</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Year: </label>
            <select className={styles.input} value={year} onChange={handleYear}>
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <button className={styles.submitButton} type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  ) : null;
}

export default Modal;
