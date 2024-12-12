import React from "react";
import styles from "./style.module.css";

function TimeLine({ groupedLogs }) {
  console.log(groupedLogs);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainTimeline}>
        {Object.keys(groupedLogs).map((date) => (
          <div key={date} className={styles.timeContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dateContainer}>
              <p>{date}</p>
            </div>
            {groupedLogs[date].map((log) => (
              <div key={log._id} className={styles.timelineCard}>
                <div className={styles.heading}>
                  <p>{log.operation} Operation</p>
                  <p>{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
                <p>
                  Officer: <span> {log.officer?.name || "Unknown"}</span>
                </p>
                <p>Student ID: {log.student.studentId || "N/A"}</p>
                <p>Student: {log.student.studentName || "N/A"}</p>

                <p>Details: {log.details || "No details provided."}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeLine;
