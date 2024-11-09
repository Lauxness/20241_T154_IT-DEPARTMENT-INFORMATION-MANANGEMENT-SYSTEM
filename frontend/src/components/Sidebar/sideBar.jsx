import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  MdLogout,
  MdNotificationImportant,
  MdPerson3,
  MdStackedBarChart,
  MdSettingsBrightness,
  MdQuestionMark,
} from "react-icons/md";

function SidebarComponent() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };

  return (
    <Sidebar width="300px" collapsed={collapsed}>
      <Menu
        menuItemStyles={{
          button: ({ level, active }) => {
            if (level === 0) {
              return {
                borderRight: active ? "3px solid blue" : undefined,
              };
            }
          },
        }}
      >
        <MenuItem
          active
          component={<Link to="/students" />}
          icon={<MdPerson3 color="#2d55fb" fontSize="20px" />}
        >
          Students
        </MenuItem>
        <SubMenu
          label="Dashboard"
          icon={<MdStackedBarChart color="#2d55fb" fontSize="20px" />}
        >
          <MenuItem component={<Link to="/dashboard/chart" />}>Chart</MenuItem>
          <MenuItem component={<Link to="/dashboard/report" />}>
            Generate Report
          </MenuItem>
          <MenuItem component={<Link to="/dashboard/chart2" />}>Chart</MenuItem>
        </SubMenu>
        <MenuItem
          component={<Link to="/announcements" />}
          icon={<MdNotificationImportant color="#2d55fb" fontSize="20px" />}
        >
          Announcements
        </MenuItem>
        <MenuItem
          component={<Link to="/notifications" />}
          icon={<MdNotificationImportant color="#2d55fb" fontSize="20px" />}
        >
          Notifications
        </MenuItem>
        <SubMenu
          label="Theme"
          icon={<MdSettingsBrightness color="#2d55fb" fontSize="20px" />}
        >
          <MenuItem>Dark theme</MenuItem>
          <MenuItem>Light theme</MenuItem>
        </SubMenu>
        <MenuItem
          component={<Link to="/faq" />}
          icon={<MdQuestionMark color="#2d55fb" fontSize="20px" />}
        >
          FAQ
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          icon={<MdLogout color="#2d55fb" fontSize="20px" />}
        >
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SidebarComponent;
