import styles from "./style.module.css";

function Notification(props) {
  console.log(props.notifications);
  return (
    <div className={styles.container}>
      <div className={styles.notificationContainer}>
        {props.notifications.map((notif, index) => (
          <div key={index} className={styles.notifCard}>
            <div className={styles.heading}>
              <p>System</p>
              <p>{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
            <p className={styles.message}>{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;
