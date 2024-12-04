import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  getAllStudents,
  deleteStudent,
  getStudent,
  unlockStudent,
} from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import OvalLoader from "../components/loader/OvalLoader";
import Upperbar from "../components/Upperbar/Upperbar";
import {
  MdEditSquare,
  MdDeleteForever,
  MdArchive,
  MdLock,
} from "react-icons/md";
import Modal from "../components/Modal/modal";
import RequirementsPopup from "../components/studentProfile/requirementsPopup";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [students, setStudents] = useState([]);
  const [searchForStudent, setSearchForStudent] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [initialStudentData, setInitialStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggerRequirements, setTriggerRequirements] = useState(false);
  const [studentData, setStudentData] = useState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const fetchStudents = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);

    setUserInfo(userData);
    try {
      const response = await getAllStudents();
      if (response.status === 200) {
        const data = response.data;
        setStudents(data);
        console.log(data);
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
  const getOneStudent = async (studentID) => {
    console.log(studentID);

    try {
      setIsLoading(true);
      const response = await getStudent(studentID);
      if (response.status === 200) {
        const studentData = response.data;
        console.log(studentData.requirements);
        setStudentData(studentData);
        setTriggerRequirements(true);
      }
    } catch (err) {
      console.log(err);
      Swal.fire(err.response.data.message, "", "error");
      return err;
    } finally {
      setIsLoading(false);
    }
  };
  const handleTriggerRequirements = async (data) => {
    if (triggerRequirements) {
      if (studentData) {
        setTriggerRequirements(false);
        await unlockStudent(studentData._id);
      }
      setStudentData(null);
    } else {
      await getOneStudent(data._id);
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
      text: "This student will be move to archives.",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isDeleted = await handleDelete(data);
        if (isDeleted) {
          Swal.fire("Moved to archives!", "", "success");
        } else {
          Swal.fire("Something went wrong!", "", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleEdit = async (data) => {
    if (trigger) {
      try {
        console.log(data._id);
        console.log("clicked", trigger);
        setTrigger(false);
        const response = await unlockStudent(data._id);
        console.log("asdfjasldkfjlsakfjdklsfalsf", response);
      } catch (err) {
        console.log(err);
      }
      setInitialStudentData(null);
    } else {
      if (data !== null) {
        try {
          const response = await getStudent(data._id);
          setInitialStudentData(response.data);
          console.log(response.data);
          setTrigger(true);
        } catch (err) {
          console.log(err.response.data.message);
          Swal.fire(err.response.data.message, "", "error");
        }
      } else {
        setTrigger(true);
      }
    }
  };

  const columns = [
    {
      name: "StudentId",
      selector: (row) => row.studentId,
      sortable: true,
      cell: (data) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p>{data.studentId}</p>
          {data.isLocked ? (
            <>
              <MdLock style={{ fontSize: "1.1em", marginLeft: "5px" }} />
            </>
          ) : (
            ""
          )}
        </div>
      ),
    },
    { name: "Name", selector: (row) => row.studentName, sortable: true },
    { name: "Program", selector: (row) => row.program, sortable: true },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
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
            justifyContent: "center",
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
            <MdArchive fontSize="20px" />
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
    height: "calc(100vh - 135px)",
    width: "100%",
    overflow: "hidden",
  };

  return (
    <>
      {isLoading ? <OvalLoader color="rgba(0, 0, 0, 0.304)" /> : ""}
      <RequirementsPopup
        trigger={triggerRequirements}
        triggerRequirements={handleTriggerRequirements}
        studentData={studentData}
      />

      <Modal
        trigger={trigger}
        triggerModal={setTrigger}
        handleEdit={handleEdit}
        initialStudentData={initialStudentData || {}}
        setInitialStudentData={setInitialStudentData}
      />

      <Header />
      <Upperbar
        userInfo={userInfo}
        currentPage="Student List"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="home"
          collapsed={collapsed}
        />
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
              <button
                style={{
                  width: "200px",
                  height: "80%",
                  border: "none",
                  fontSize: "15px",
                  color: "white",
                  backgroundColor: "#2d55fb",
                  borderRadius: "4px",
                }}
                onClick={() => handleEdit(null)}
              >
                Add student
              </button>
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
            <div>Loading students...</div>
          ) : (
            <DataTable
              columns={columns}
              data={searchForStudent}
              fixedHeader
              onRowClicked={(data) => handleTriggerRequirements(data)}
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
