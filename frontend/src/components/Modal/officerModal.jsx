import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import { addEnrollmentOfficer, updateEnrollmentOfficer } from "../../api";
import Swal from "sweetalert2";
import OvalLoader from "../loader/OvalLoader";
import { useNavigate } from "react-router-dom";

function OfficerModal(props) {
  const [emailAddress, setEmailAddress] = useState("");
  const [assignedYear, setAssignedYear] = useState("");
  const [assignedProgram, setAssignedProgram] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (props.trigger) {
      setEmailAddress(props.initialOfficerData.emailAddress || "");
      setAssignedYear(props.initialOfficerData.assignedYear || "");
      setAssignedProgram(props.initialOfficerData.assignedProgram || "");
    }
  }, [props.trigger, props.initialOfficerData]);

  const handleClose = () => {
    console.log(props.initialOfficerData);

    props.triggerModal();
    props.setInitialOfficerData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEnrollmentOfficer = {
      googleId: "",
      name: "",
      emailAddress,
      profilePicture: "",
      accessToken: "",
      refreshToken: "",
      role: "officer",
      assignedYear,
      assignedProgram,
    };
    try {
      setIsLoading(true);
      let response;
      if (props.initialOfficerData?._id) {
        response = await updateEnrollmentOfficer(
          newEnrollmentOfficer,
          props.initialOfficerData._id
        );
      } else {
        response = await addEnrollmentOfficer(newEnrollmentOfficer);
      }
      if (response.status === 200) {
        handleClose();
        showSwal(true, response.data.message);
      } else {
        showSwal(false, response.data.message, response.status);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.error("Error:", message);
      showSwal(false, message);
    } finally {
      setIsLoading(false);
    }
  };
  const showSwal = (success, message, status) => {
    const swalOptions = success
      ? {
          icon: "success",
          text: message,
          showConfirmButton: true,
        }
      : {
          icon: "error",
          title: "Oops...",
          text: message,
        };
    Swal.fire(swalOptions).then((result) => {
      if (!success && status === 401) {
        localStorage.removeItem("user-info");
        navigate("/");
      } else {
        window.location.reload();
      }
    });
  };

  return props.trigger ? (
    <div className={styles.popUpContainer}>
      {isLoading ? <OvalLoader /> : ""}
      <div className={styles.popUpInner}>
        <div className={styles.header}>
          <p className={styles.title}>
            {props.initialOfficerData?._id ? "Edit Officer" : "Add Officer"}
          </p>
          <button className={styles.closeButton} onClick={handleClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address: </label>
            <input
              type="email"
              required
              className={styles.input}
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Assigned Program: </label>
            <select
              className={styles.input}
              value={assignedProgram}
              onChange={(e) => setAssignedProgram(e.target.value)}
            >
              <option value="">Select program</option>
              <option value="BSIT">BSIT</option>
              <option value="BSEMC">BSEMC</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Assigned Year: </label>
            <select
              className={styles.input}
              value={assignedYear}
              onChange={(e) => setAssignedYear(e.target.value)}
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

export default OfficerModal;
