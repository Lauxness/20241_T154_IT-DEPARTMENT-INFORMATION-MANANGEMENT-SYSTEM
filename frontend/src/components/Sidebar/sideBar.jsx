import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  MdLogout,
  MdNotifications,
  MdPerson3,
  MdStackedBarChart,
  MdDownload,
  MdArchive,
  MdQuestionMark,
  MdTimeline,
  MdAreaChart,
  MdSupervisorAccount,
} from "react-icons/md";
import "./style.css";
import Swal from "sweetalert2";

import { getNotifications } from "../../api";

function SidebarComponent(props) {
  const navigate = useNavigate();
  const [notificationLength, setNotificationLength] = useState();
  const [userInfo, setUserInfo] = useState({});
  const fetchNotifications = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
    try {
      const response = await getNotifications();

      if (response.status === 200) {
        const notifs = response.data;
        setNotificationLength(notifs.length);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/dashboard/generate_report",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Corrected 'Bearer'
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      console.log("Blob Size:", blob.size);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_information_report_summary.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };
  const showSwal = () => {
    Swal.fire({
      icon: "warning",
      text: "Are you sure you want to Logout?",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };
  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };
  return (
    <Sidebar width="300px" collapsed={props.collapsed}>
      <Menu
        menuItemStyles={{
          button: ({ level, active }) => {
            if (level === 1 || level === 0) {
              return {
                borderRight: active && level === 0 ? " 3px solid #2d55fb" : "",
                backgroundColor:
                  active || (active && level === 1)
                    ? "rgba(45, 85, 251, 0.2 )"
                    : undefined,
              };
            }
          },
        }}
      >
        <MenuItem
          active={props.currentPage === "chart"}
          component={<Link to="/dashboard" />}
          icon={<MdAreaChart color="#2d55fb" fontSize="20px" />}
        >
          Dashboard
        </MenuItem>

        {props.userInfo?.role === "admin" ? (
          <MenuItem
            component={<Link to="/enrollment_officers" />}
            active={props.currentPage === "enrollmentOfficers"}
            icon={<MdSupervisorAccount color="#2d55fb" fontSize="20px" />}
          >
            Enrollment Officers
          </MenuItem>
        ) : null}

        <MenuItem
          active={props.currentPage === "home"}
          component={<Link to="/home" />}
          icon={<MdPerson3 color="#2d55fb" fontSize="20px" />}
        >
          Students
        </MenuItem>
        <MenuItem
          active={props.currentPage === "archive"}
          component={<Link to="/archived_students" />}
          icon={<MdArchive color="#2d55fb" fontSize="20px" />}
          className="sidebar-menu-item"
        >
          Archived students
        </MenuItem>
        <MenuItem
          active={props.currentPage === "activityLogs"}
          component={<Link to="/activity_logs" />}
          icon={<MdTimeline color="#2d55fb" fontSize="20px" />}
          className="sidebar-menu-item"
        >
          Activity logs
        </MenuItem>
        <MenuItem
          active={props.currentPage === "notifications"}
          component={<Link to="/notifications" />}
          icon={<MdNotifications color="#2d55fb" fontSize="20px" />}
          style={{ position: "relative" }}
        >
          <div className="notifCount">{notificationLength || 0}</div>
          Notifications
        </MenuItem>
        <MenuItem
          active={props.currentPage === "generate_report"}
          onClick={() => handleDownload()}
          icon={<MdDownload color="#2d55fb" fontSize="20px" />}
        >
          Download Report
        </MenuItem>
        <MenuItem
          active={props.currentPage === "faq"}
          component={<Link to="/faq" />}
          icon={<MdQuestionMark color="#2d55fb" fontSize="20px" />}
        >
          FAQ
        </MenuItem>

        <MenuItem
          onClick={showSwal}
          icon={<MdLogout color="#2d55fb" fontSize="20px" />}
        >
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SidebarComponent;
