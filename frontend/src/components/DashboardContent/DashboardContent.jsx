import styles from "./style.module.css";
import Officer from "../../assets/dashboard/Officer.png";
import Student from "../../assets/dashboard/student.png";
import Requirement from "../../assets/dashboard/requirements.png";
import Complete from "../../assets/dashboard/complete.png";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import DoughnutChart from "../charts/DoughnutChart";
import BarChart from "../charts/BarChart";
import SharpLineChart from "../charts/SharpLineChart";
import SmoothLineChart from "../charts/SmoothLineChart";
import SmoothPointLineChart from "../charts/SmoothPointLineChart";
function DashboardContent(props) {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <p>Total Students</p>
            <img src={Student} alt="" width="30px" />
          </div>
          <div className={styles.dataContainer}>
            <p>{props.dashboardData?.totalStudents || 0}</p>
            <div>
              <SmoothPointLineChart />
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <p>Complete Requirements</p>
            <img src={Complete} alt="" width="30px" />
          </div>
          <div className={styles.dataContainer}>
            <p>{props.dashboardData?.totalComplete || 0}</p>
            <div>
              <SmoothLineChart />
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <p> Total Enrollment Officer</p>
            <img src={Officer} alt="" width="30px" />
          </div>
          <div className={styles.dataContainer}>
            <p>{props.dashboardData?.totalOfficers || 0}</p>
            <div>
              {" "}
              <SharpLineChart />
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <p>Requirements submitted</p>
            <img src={Requirement} alt="" width="30px" />
          </div>
          <div className={styles.dataContainer}>
            <p>{props.dashboardData?.totalRequirements || 0}</p>
            <div>
              <BarChart />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.donnutChart}>
          <p>Requirements completion summary</p>
          <div>
            <DoughnutChart
              totalIncomplete={props.dashboardData?.totalIncomplete}
              totalComplete={props.dashboardData?.totalComplete}
            />
          </div>
        </div>
        <div className={styles.barChart}>
          <p>Total of student per year</p>
          <HorizontalBarChart dashboardData={props.dashboardData} />
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
