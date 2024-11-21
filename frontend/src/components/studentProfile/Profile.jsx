import styles from "./style.module.css";
import TestProfile from "../../assets/testProfile.png";
function Profile(props) {
  return (
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
  );
}
export default Profile;
