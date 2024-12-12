import styles from "./style.module.css";
import TestProfile from "../../assets/testProfile.png";
import { notifyStudent } from "../../api";
import Swal from "sweetalert2";
import OvalLoader from "../loader/OvalLoader";
import { Oval } from "react-loader-spinner";
import { useState } from "react";
function Profile(props) {
  const [isLoading, setIsLoading] = useState(false);
  const sendNotification = async (id) => {
    try {
      setIsLoading(true);
      const response = await notifyStudent(id);
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      setIsLoading(false);
    }
  };

  const showSwal = async (id) => {
    if (props.selectedSemester !== props.currentSemester) {
      return Swal.fire(
        "Sorry",
        "You cant perform that here you need to be in the latest semester.",
        "error"
      );
    }
    Swal.fire({
      title: "Continue?",
      text: "This student will get notified!",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isNotified = await sendNotification(id);
        if (isNotified.status === 200) {
          Swal.fire(isNotified.data.message, "", "success");
        } else {
          Swal.fire(isNotified.response.data.message, "", "error");
        }
      }
    });
  };
  return (
    <>
      {isLoading ? <OvalLoader color="rgba(0, 0, 0, 0.304)" /> : ""}
      <div className={styles.leftSide}>
        <div className={styles.studentName}>
          <div>
            <div className={styles.profileContainer}>
              <img src={TestProfile} alt="" height="130px" />
            </div>
          </div>

          <p className={styles.name}>{props.studentData.studentName}</p>
        </div>
        <div className={styles.studentInformation}>
          <div className={styles.studentInformation1}>
            <p>Student information</p>
            <div>
              <p>{props.studentData.studentId}</p>
              <p>{props.studentData.studentName}</p>
              <p>{props.studentData.email}</p>
              <p>{props.studentData.phoneNumber}</p>
            </div>
          </div>
          <div className={styles.studentInformation1}>
            <p>Student status</p>
            <div>
              <p>{props.studentData.year}</p>
              <p>{props.studentData.program}</p>
              <p>{props.studentData.status} requirements</p>
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => {
                showSwal(props.studentData._id);
              }}
            >
              Notify Student
            </button>
            <button
              className={styles.button}
              onClick={() => {
                props.triggerRequirements(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
