import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import React, { useState, useEffect } from "react";
import OvalLoader from "../components/loader/OvalLoader";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null); // Initialize as null to better handle conditional rendering

  const fetchStudents = async () => {
    const data = localStorage.getItem("user-info");
    if (data) {
      const userData = JSON.parse(data);
      setUserInfo(userData);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (userInfo) {
      console.log("User info fetched:", userInfo);
    }
  }, [userInfo]);
  if (!userInfo) {
    return (
      <>
        <OvalLoader />
      </>
    );
  }
  return (
    <>
      {!userInfo ? <OvalLoader /> : <OvalLoader />}
      <Header />
      <SidebarComponent userInfo={userInfo} currentPage="chart" />
    </>
  );
}

export default Dashboard;
