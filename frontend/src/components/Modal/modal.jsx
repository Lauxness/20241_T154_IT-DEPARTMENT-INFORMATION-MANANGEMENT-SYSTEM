import { useState, useEffect } from "react";
import styles from "./style.module.css";
import { addStudent, updateStudent } from "../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import OvalLoader from "../loader/OvalLoader";
function Modal(props) {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [program, setProgram] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState();
  const [semesterGWA, setSemesterGWA] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (props.trigger) {
      setStudentId(props.initialStudentData.studentId || "");
      setStudentName(props.initialStudentData.studentName || "");
      setYear(props.initialStudentData.year || "");
      setEmail(props.initialStudentData.email || "");
      setPhoneNumber(props.initialStudentData.phoneNumber || "");
      setProgram(props.initialStudentData.program || "");
      setStatus(props.initialStudentData.status || "");
      setSemesterGWA(props.initialStudentData.semesterGWA || "");
    }
  }, [props.trigger, props.initialStudentData]);

  const handleClose = () => {
    if (props.initialStudentData._id !== undefined) {
      console.log("click");
      props.handleEdit(props.initialStudentData);
    } else {
      props.triggerModal(false);
    }
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
      semesterGWA,
      ...(status && { status }),
    };

    try {
      let response;
      setIsLoading(true);
      if (props.initialStudentData.studentId) {
        console.log("new student", newStudent);
        response = await updateStudent(
          newStudent,
          props.initialStudentData._id
        );
        if (response.status === 200) {
          handleClose();
          setIsLoading(false);
          showSwal(true, response.data.message, response.status);
        }
      } else {
        console.log("add");
        response = await addStudent(newStudent);
        if (response.status === 200) {
          handleClose();
          setIsLoading(false);
          showSwal(true, response.data.message, response.status);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      showSwal(false, error.response.data.message, error.response.status);
    }
  };

  const showSwal = (success, message, status) => {
    if (success) {
      Swal.fire({
        icon: "success",
        text: message,
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
        text: message,
      }).then(() => {
        if (!success && status === 401) {
          localStorage.removeItem("user-info");
          navigate("/");
        }
      });
    }
  };

  return props.trigger ? (
    <div className={styles.popUpContainer}>
      {isLoading ? <OvalLoader color="rgba(0, 0, 0, 0.304)" /> : ""}
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
              disabled={!!props.initialStudentData.studentId}
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
          {status ? (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Status </label>
              <select
                className={styles.input}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
                <option value="LOA">LOA</option>
              </select>
            </div>
          ) : (
            ""
          )}
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
            <label className={styles.label}>GWA</label>
            <input
              className={styles.input}
              value={semesterGWA}
              onChange={(e) => setSemesterGWA(e.target.value)}
            />
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
