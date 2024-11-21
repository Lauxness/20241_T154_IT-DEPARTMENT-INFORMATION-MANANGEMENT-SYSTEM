import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllEnrollmentOfficers, deleteOfficer } from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import { MdEditSquare, MdDeleteForever } from "react-icons/md";
import OfficerModal from "../components/Modal/officerModal";
import OvalLoader from "../components/loader/OvalLoader";
function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [Officers, setOfficers] = useState([]);
  const [searchForOfficer, setSearchForOfficer] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [initialOfficerData, setInitialOfficerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEnrollmentOfficers = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
    try {
      const response = await getAllEnrollmentOfficers();
      if (response.status === 200) {
        const data = response.data;
        setOfficers(data);
        setSearchForOfficer(data);
      } else if (response.status == 401) {
        showSwalTokenExp();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = () => {
    if (trigger) {
      setTrigger(false);
      setInitialOfficerData(null);
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
          Swal.fire("Deleted!", "", "success").then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          showSwalTokenExp();
        }
      }
    });
  };

  useEffect(() => {
    fetchEnrollmentOfficers();
  }, []);

  const handleDelete = async (data) => {
    const id = data._id;
    try {
      setIsLoading(true);
      const response = await deleteOfficer(id);
      if (response.status === 200) {
        console.log(response);
        return true;
      } else {
        console.error("Failed to delete Officer:", response);
        return false;
      }
    } catch (error) {
      console.error("Error deleting Officer:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (data) => {
    setInitialOfficerData(data);
    console.log(data);
    handleTrigger();
  };

  const columns = [
    { name: "Officer Email", selector: (row) => row.emailAddress },
    {
      name: "Name",
      selector: (row) => row.name || "Waiting to Login for the first time",
      sortable: true,
      cell: (data) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {data.profilePicture ? (
            <img
              src={data.profilePicture}
              alt="Profile"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
          ) : (
            ""
          )}
          <p>{data.name || "Waiting the first Login"}</p>
        </div>
      ),
    },
    {
      name: "Assigned Year",
      selector: (row) => row.assignedYear || "Not Assigned",
      sortable: true,
    },
    {
      name: "Assigned Program",
      selector: (row) => row.assignedProgram || "Not Assigned",
      sortable: true,
    },
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
      setSearchForOfficer(Officers);
      return;
    }

    const filteredData = Officers.filter((row) => {
      if (!isNaN(e)) {
        return row.emailAddress.toString().includes(e.toString());
      } else {
        return row.emailAddress.toLowerCase().includes(e.toLowerCase());
      }
    });
    setSearchForOfficer(filteredData);
  };

  const containerStyle = {
    display: "flex",
    height: "calc(100vh - 71px)",
    width: "100%",
    overflow: "hidden",
  };

  return (
    <>
      {isLoading ? <OvalLoader /> : ""}
      <OfficerModal
        trigger={trigger}
        triggerModal={setTrigger}
        initialOfficerData={initialOfficerData || {}}
        setInitialOfficerData={setInitialOfficerData}
      />
      <Header />
      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="enrollmentOfficers"
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
              borderBottom: "1px solid #ababab",

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
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                Enrollment Officers List
              </p>
            </div>
            <div
              style={{
                width: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                paddingRight: "10px",
                gap: "10px",
                paddingBottom: "6px",
              }}
            >
              <div style={{ textAlign: "end", fontSize: "12px" }}>
                <p>
                  {userInfo?.role || "Guest"} , {userInfo?.name || "Guest"}
                </p>
                <p>{userInfo?.emailAddress || "No email available"}</p>
              </div>
              <div style={{ padding: "0", height: "35px" }}>
                <img
                  src={userInfo?.profilePicture || "No email available"}
                  alt=""
                  width="35px"
                  style={{ height: "100%", borderRadius: "50%" }}
                />
              </div>
            </div>
          </div>
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
                onClick={handleTrigger}
              >
                Add Officer
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
            <div>Loading Officers...</div>
          ) : (
            <DataTable
              columns={columns}
              data={searchForOfficer}
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
