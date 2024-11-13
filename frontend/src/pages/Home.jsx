import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import { MdEditSquare, MdDeleteForever } from "react-icons/md";
import Modal from "../components/Modal/modal";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [students, setStudents] = useState([]);
  const [searchForStudent, setSearchForStudent] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [initialStudentData, setInitialStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
    try {
      const response = await getAllStudents();
      const data = response.data;
      setStudents(data);
      setSearchForStudent(data);
    } catch (error) {
      showSwalTokenExp();
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = () => {
    if (trigger) {
      setTrigger(false);
      setInitialStudentData(null);
    } else {
      setTrigger(true);
    }
  };

  const showSwalTokenExp = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your token has expired, Please login again",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user-info");
        navigate("/");
      }
    });
  };

  const showSwal = async (data) => {
    Swal.fire({
      title: "Are you sure you want to Delete?",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isDeleted = await handleDelete(data);
        if (isDeleted) {
          Swal.fire("Deleted!", "", "success");
        } else {
          showSwalTokenExp();
        }
      }
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array ensures this runs only once on mount.

  const handleDelete = async (data) => {
    const id = data._id;
    try {
      const response = await deleteStudent(id);
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

  const handleEdit = (data) => {
    setInitialStudentData(data);
    handleTrigger();
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
      cell: (data) => (
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
            onClick={() => showSwal(data)}
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
            onClick={() => handleEdit(data)}
          >
            <MdEditSquare fontSize="20px" />
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
    height: "calc(100vh - 71px)",
    width: "100%",
    overflow: "hidden",
  };

  return (
    <>
      <Modal
        trigger={trigger}
        triggerModal={setTrigger}
        initialStudentData={initialStudentData || {}}
        setInitialStudentData={setInitialStudentData}
      />
      <Header />
      <div style={containerStyle}>
        <SidebarComponent userInfo={userInfo} />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginLeft: "20px",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #ababab",
              paddingBottom: "10px",
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
              <button
                style={{
                  width: "200px",
                  height: "100%",
                  border: "none",
                  fontSize: "15px",
                  color: "white",
                  backgroundColor: "#2d55fb",
                  borderRadius: "4px",
                }}
                onClick={handleTrigger}
              >
                Add student
              </button>
              <SearchBar
                onChange={(e) => searchHandler(e)}
                style={{
                  boxShadow: "0px 1px 2px rgba(141, 192, 247,5)",
                  maxWidth: "500px",
                  flex: "1",
                  margin: "0",
                }}
              />
            </div>
            <div
              style={{
                width: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                paddingRight: "10px",
                gap: "10px",
              }}
            >
              <div style={{ textAlign: "end", fontSize: "12px" }}>
                <p>
                  {userInfo?.role || "Guest"} , {userInfo?.name || "Guest"}
                </p>
                <p>{userInfo?.emailAddress || "No email available"}</p>
              </div>
              <div style={{ padding: "0", height: "40px" }}>
                <img
                  src={userInfo?.profilePicture || "No email available"}
                  alt=""
                  width="40px"
                  style={{ height: "100%", borderRadius: "50%" }}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div>Loading students...</div>
          ) : (
            <DataTable
              columns={columns}
              data={searchForStudent}
              fixedHeader
              pagination
              highlightOnHover
              pointerOnHover
              alternate
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
