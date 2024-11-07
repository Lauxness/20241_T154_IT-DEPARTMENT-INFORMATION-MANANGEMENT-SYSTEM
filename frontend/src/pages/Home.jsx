import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api";
import DataTable, { Alignment } from "react-data-table-component";
import Header from "../components/Header/Header";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  MdPerson3,
  MdStackedBarChart,
  MdEditSquare,
  MdLogout,
  MdNotificationImportant,
  MdDeleteForever,
} from "react-icons/md";
function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = React.useState(false);
  const fetchStudents = async () => {
    const response = await getAllStudents();
    console.log(response.data);
    const data = response.data;
    setStudents(data);
  };
  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    fetchStudents();

    console.log(userData);
    setUserInfo(userData);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };
  const handleDelete = async (data) => {
    const id = data._id;
    try {
      const response = await deleteStudent(id);
      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
        console.log("Student deleted successfully:", response.data);
      } else {
        console.error("Failed to delete student:", response);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const columns = [
    { name: "StudentID", selector: (row) => row.studentId },
    { name: "Name", selector: (row) => row.studentName, sortable: true },
    { name: "Program", selector: (row) => row.program },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Email", selector: (row) => row.email },
    { name: "Status", selector: (row) => row.status },
    {
      name: "Actions",
      align: "center",
      button: true,
      cell: (data, index) => (
        <div
          style={{
            display: "flex",
            height: "60%",
            width: "100px",
            gap: "10px",
          }}
        >
          <button
            style={{
              backgroundColor: "#f44960",
              padding: "5px ",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
            onClick={() => handleDelete(data)}
          >
            <MdDeleteForever fontSize="20px" />
          </button>
          <button
            style={{
              backgroundColor: "#2b9447",
              padding: "5px",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            <MdEditSquare fontSize="20px" />
          </button>
        </div>
      ),
    },
  ];
  const contianer = {
    display: "flex",
    height: "calc(100vh - 71px)",
    width: "100%",
  };
  return (
    <>
      <Header />
      <div style={contianer}>
        <Sidebar width="300px" collapsed={collapsed}>
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                if (level === 0)
                  return {
                    backgroundColor: active ? "#eecef9" : undefined,
                  };
              },
            }}
          >
            <MenuItem
              component={<Link to="/" />}
              icon={<MdPerson3 color="#2d55fb" fontSize="20px" />}
            >
              Students
            </MenuItem>
            <MenuItem
              component={<Link to="/" />}
              icon={<MdStackedBarChart color="#2d55fb" fontSize="20px" />}
            >
              {" "}
              Dashboard
            </MenuItem>
            <MenuItem
              component={<Link to="/" />}
              icon={<MdNotificationImportant color="#2d55fb" fontSize="20px" />}
            >
              Announcements
            </MenuItem>
            <MenuItem
              onClick={() => handleLogout()}
              icon={<MdLogout color="#2d55fb" fontSize="20px" />}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>

        <DataTable
          columns={columns}
          data={students}
          fixedHeader
          pagenation
        ></DataTable>
      </div>
    </>
  );
}
export default Home;
