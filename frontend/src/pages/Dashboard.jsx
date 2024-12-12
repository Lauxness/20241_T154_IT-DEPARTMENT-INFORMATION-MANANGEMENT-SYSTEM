import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import React, { useState, useEffect } from "react";
import OvalLoader from "../components/loader/OvalLoader";
import { getDashBoard } from "../api";
import Upperbar from "../components/Upperbar/Upperbar";
import DashboardContent from "../components/DashboardContent/DashboardContent";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardData, setDashBoardData] = useState();
  const [loading, setLoading] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const fetchDashBoard = async () => {
    try {
      setLoading(true);
      const response = await getDashBoard();
      console.log("response is : ", response);
      if (response.status === 200) {
        const {
          students = [],
          accounts = [],
          requirement = [],
        } = response.data;

        const totals = {
          totalStudents: students.length,
          totalComplete: students.filter((s) => s.isComplete === true).length,
          totalIncomplete: students.filter((s) => s.isComplete === false)
            .length,
          totalFirstYear: students.filter((s) => s.year === "1st Year").length,
          totalSecondYear: students.filter((s) => s.year === "2nd Year").length,
          totalThirdYear: students.filter((s) => s.year === "3rd Year").length,
          totalFourthYear: students.filter((s) => s.year === "4th Year").length,
          totalOfficers: accounts.length,
          totalRequirements: requirement.length,
        };

        setDashBoardData(totals);
        console.log(dashboardData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    if (data) {
      setUserInfo(JSON.parse(data));
    }
    fetchDashBoard();
  }, []);
  const containerStyle = {
    display: "flex",
    height: "calc(100vh - 135px)",
    width: "100%",
  };

  return (
    <>
      <Header />
      <Upperbar
        userInfo={userInfo}
        currentPage="Dashboard"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="chart"
          collapsed={collapsed}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginLeft: "10px",
            marginTop: "5px",
            position: "relative",
          }}
        >
          {loading ? (
            <OvalLoader />
          ) : (
            <DashboardContent dashboardData={dashboardData} />
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
