import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllArchivedStudents, restoreStudent } from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import OvalLoader from "../components/loader/OvalLoader";
import Upperbar from "../components/Upperbar/Upperbar";
import { MdEditSquare, MdRestoreFromTrash, MdArchive } from "react-icons/md";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [students, setStudents] = useState([]);
  const [searchForStudent, setSearchForStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const fetchStudents = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);

    setUserInfo(userData);
    try {
      const response = await getAllArchivedStudents();
      if (response.status === 200) {
        const data = response.data;
        setStudents(data);
        setSearchForStudent(data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        showSwalTokenExp();
      }
    } finally {
      setLoading(false);
    }
  };

  const showSwalTokenExp = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please login first.",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user-info");
        navigate("/");
      }
    });
  };

  const showSwal = async (data) => {
    Swal.fire({
      title: "Continue?",
      text: "This student will be restored from archives.",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isDeleted = await handleRestore(data);
        if (isDeleted) {
          Swal.fire("Student restored!", "", "success");
        } else {
          Swal.fire("Something went wrong!", "", "Error");
        }
      }
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRestore = async (data) => {
    const id = data._id;
    try {
      const response = await restoreStudent(id);
      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
        setSearchForStudent((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
        return true;
      } else {
        console.error("Failed to delete student:", response);
        return false;
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      return false;
    }
  };

  const columns = [
    { name: "StudentID", selector: (row) => row.studentId, sortable: true },
    { name: "Name", selector: (row) => row.studentName, sortable: true },
    { name: "Program", selector: (row) => row.program, sortable: true },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Actions",

      button: true,
      cell: (data) => (
        <div
          style={{
            display: "flex",
            height: "60%",
            width: "100px",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            style={{
              backgroundColor: "#2b9447",
              padding: "5px ",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
            onClick={() => showSwal(data)}
          >
            <MdRestoreFromTrash fontSize="20px" />
          </button>
        </div>
      ),
    },
  ];

  const searchHandler = (e) => {
    if (e === "") {
      setSearchForStudent(students);
      return;
    }

    const filteredData = students.filter((row) => {
      if (!isNaN(e)) {
        return row.studentId.toString().includes(e.toString());
      } else {
        return row.studentName.toLowerCase().includes(e.toLowerCase());
      }
    });

    setSearchForStudent(filteredData);
  };

  const containerStyle = {
    display: "flex",
    height: "calc(100vh - 135px)",
    width: "100%",
    overflow: "hidden",
  };

  return (
    <>
      <Header />
      <Upperbar
        userInfo={userInfo}
        currentPage="Archived student list"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="archive"
          collapsed={collapsed}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginLeft: "20px",

            position: "relative",
          }}
        >
          <div
            style={{
              paddingBottom: "5px",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                gap: "10px",
                flex: "1",
              }}
            >
              <SearchBar
                onChange={(e) => searchHandler(e)}
                style={{
                  boxShadow: "0px 1px 2px rgba(141, 192, 247,5)",
                  height: "80%",
                  flex: "1",
                  margin: "0",
                }}
              />
            </div>
          </div>
          {loading ? (
            <OvalLoader />
          ) : (
            <DataTable
              columns={columns}
              data={searchForStudent}
              fixedHeader
              pagination
              highlightOnHover
              pointerOnHover
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
