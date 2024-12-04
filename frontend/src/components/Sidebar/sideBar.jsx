import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  MdLogout,
  MdNotificationImportant,
  MdPerson3,
  MdStackedBarChart,
  MdSettingsBrightness,
  MdArchive,
  MdQuestionMark,
} from "react-icons/md";
import "./style.css";
import Swal from "sweetalert2";

function SidebarComponent(props) {
  const navigate = useNavigate();

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
          active={props.currentPage === "home"}
          component={<Link to="/home" />}
          icon={<MdPerson3 color="#2d55fb" fontSize="20px" />}
        >
          Students
        </MenuItem>
        <SubMenu
          active={
            props.currentPage === "enrollmentOfficers" ||
            props.currentPage === "chart" ||
            props.currentPage === "generate_report"
          }
          defaultOpen={
            props.currentPage === "enrollmentOfficers" ||
            props.currentPage === "chart"
          }
          label="Dashboard"
          icon={<MdStackedBarChart color="#2d55fb" fontSize="20px" />}
        >
          <MenuItem
            active={props.currentPage === "chart"}
            component={<Link to="/dashboard" />}
          >
            Chart
          </MenuItem>
          <MenuItem
            active={props.currentPage === "generate_report"}
            component={<Link to="/dashboard/report" />}
          >
            Generate Report
          </MenuItem>

          {props.userInfo?.role === "admin" ? (
            <MenuItem
              component={<Link to="/enrollment_officers" />}
              active={props.currentPage === "enrollmentOfficers"}
            >
              Enrollment Officers
            </MenuItem>
          ) : null}
        </SubMenu>

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
          icon={<MdNotificationImportant color="#2d55fb" fontSize="20px" />}
          className="sidebar-menu-item"
        >
          Activity logs
        </MenuItem>
        <MenuItem
          active={props.currentPage === "notifications"}
          component={<Link to="/notifications" />}
          icon={<MdNotificationImportant color="#2d55fb" fontSize="20px" />}
        >
          Notifications
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
