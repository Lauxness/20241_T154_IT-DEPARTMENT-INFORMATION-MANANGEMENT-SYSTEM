import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { addStudent, updateStudent } from "../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Modal(props) {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [program, setProgram] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (props.trigger) {
      setStudentId(props.initialStudentData.studentId || "");
      setStudentName(props.initialStudentData.studentName || "");
      setYear(props.initialStudentData.year || "");
      setEmail(props.initialStudentData.email || "");
      setPhoneNumber(props.initialStudentData.phoneNumber || "");
      setProgram(props.initialStudentData.program || "");
    }
  }, [props.trigger, props.initialStudentData]);

  const handleClose = () => {
    props.triggerModal();
    props.setInitialStudentData(null);
    console.log(props.initialStudentData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStudent = {
      studentId,
      studentName,
      year,
      email,
      phoneNumber,
      program,
    };

    try {
      let response;

      if (props.initialStudentData.studentId) {
        // Update existing student
        response = await updateStudent(
          newStudent,
          props.initialStudentData._id
        );

        if (response.status === 200) {
          handleClose();
          showSwal(true, response.data.message);
        } else if (response.status === 409) {
          showSwal(false, "Student Already Exists");
        } else {
          showSwal(false, "Failed to update Student");
        }
      } else {
        // Add new student
        response = await addStudent(newStudent);

        if (response.status === 201) {
          handleClose();
          showSwal(true, "Student Added Successfully");
        } else if (response.status === 409) {
          showSwal(false, "Student Already Exists");
        } else {
          showSwal(false, "Failed to add Student");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showSwal(
        false,
        error.response?.data?.message || "Failed to save Student"
      );
    }
  };

  const showSwal = (success, message) => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: message,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message + ", Please login again.",
      }).then((result) => {
        localStorage.removeItem("user-info");
        navigate("/");
      });
    }
  };

  return props.trigger ? (
    <div className={styles.popUpContainer}>
      <div className={styles.popUpInner}>
        <div className={styles.header}>
          <p className={styles.title}>
            {props.initialStudentData.studentId
              ? "Edit Student"
              : "Add Student"}
          </p>
          <button className={styles.closeButton} onClick={handleClose}>
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
              onChange={(e) => setStudentId(e.target.value)}
              maxLength={10}
              minLength={10}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Student Name: </label>
            <input
              type="text"
              required
              className={styles.input}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address: </label>
            <input
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number: </label>
            <input
              type="tel"
              required
              className={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Program: </label>
            <select
              className={styles.input}
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="">Select program</option>
              <option value="BSIT">BSIT</option>
              <option value="BSEMC">BSEMC</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Year: </label>
            <select
              className={styles.input}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
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
