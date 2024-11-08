import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api";
import DataTable, { Alignment } from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import { MdEditSquare, MdDeleteForever } from "react-icons/md";
import Modal from "../components/Modal/modal";
function Home() {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchForStudent, setsearchForStudent] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      console.log(response.data);
      const data = response.data;
      setStudents(data);
      setsearchForStudent(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };
  const handleTrigger = () => {
    if (trigger) {
      setTrigger(false);
    } else {
      setTrigger(true);
    }
  };
  const showSwal = (data) => {
    Swal.fire({
      title: "Are you sure you want to Delete?",
      icon: "question",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        handleDelete(data);
        Swal.fire("Deleted!", "", "success");
      }
    });
  };
  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    fetchStudents();
    console.log("userData", userData);
    setUserInfo(userData || {}); // Ensure userInfo is always an object
  }, []);

  console.log("Students", searchForStudent);

  const handleDelete = async (data) => {
    const id = data._id;
    try {
      const response = await deleteStudent(id);
      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== id)
        );
        setsearchForStudent((prevStudents) =>
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

  const handleEdit = (data) => {
    navigate(`/edit-student/${data._id}`);
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
    console.log(e);

    if (e === "") {
      setsearchForStudent(students);
      return;
    }

    const filteredData = students.filter((row) => {
      if (!isNaN(e)) {
        return row.studentId.toString().includes(e.toString());
      } else {
        return row.studentName.toLowerCase().includes(e.toLowerCase());
      }
    });

    console.log(filteredData);
    setsearchForStudent(filteredData);
  };

  const containerStyle = {
    display: "flex",
    height: "calc(100vh - 71px)",
    width: "100%",
  };

  return (
    <>
      <Modal trigger={trigger} triggerModal={setTrigger}></Modal>
      <Header />
      <div style={containerStyle}>
        <SidebarComponent />
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
                <p>{userInfo?.name || "Guest"}</p>
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
          <DataTable
            columns={columns}
            data={searchForStudent}
            fixedHeader
            pagination
          />
        </div>
      </div>
    </>
  );
}

export default Home;
