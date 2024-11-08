import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  MdLogout,
  MdNotificationImportant,
  MdPerson3,
  MdStackedBarChart,
  MdSettingsBrightness,
  MdQuestionMark,
} from "react-icons/md";
function SidebarComponent() {
  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Sidebar width="300px" collapsed={collapsed}>
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0)
              return {
                backgroundColor: active ? "#e7e7e7" : undefined,
              };
          },
        }}
      >
        <MenuItem
          active
          component={<Link to="/" />}
          icon={<MdPerson3 color="#2d55fb" fontSize="20px" />}
        >
          Students
        </MenuItem>
        <SubMenu
          label="Dashboard"
          icon={<MdStackedBarChart color="#2d55fb" fontSize="20px" />}
        >
          <MenuItem component={<Link to="/" />}>Chart</MenuItem>
          <MenuItem component={<Link to="/" />}>Generate Report</MenuItem>
          <MenuItem component={<Link to="/" />}>Chart</MenuItem>
        </SubMenu>

        <MenuItem
          component={<Link to="/" />}
          icon={<MdNotificationImportant color="#2d55fb" fontSize="20px" />}
        >
          Announcements
        </MenuItem>
        <MenuItem
          component={<Link to="/" />}
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
          component={<Link to="/" />}
          icon={<MdQuestionMark color="#2d55fb" fontSize="20px" />}
        >
          FaQ
        </MenuItem>
        <MenuItem
          onClick={() => handleLogout()}
          icon={<MdLogout color="#2d55fb" fontSize="20px" />}
        >
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
export default SidebarComponent;
