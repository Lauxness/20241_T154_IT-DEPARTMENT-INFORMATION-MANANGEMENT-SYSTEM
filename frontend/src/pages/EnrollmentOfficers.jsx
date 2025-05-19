import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllEnrollmentOfficers, deleteOfficer, addAdmin } from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import { MdEditSquare, MdDeleteForever, MdLock } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import OfficerModal from "../components/Modal/officerModal";
import OvalLoader from "../components/loader/OvalLoader";
import Upperbar from "../components/Upperbar/Upperbar";
function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [Officers, setOfficers] = useState([]);
  const [searchForOfficer, setSearchForOfficer] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [initialOfficerData, setInitialOfficerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const fetchEnrollmentOfficers = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
    try {
      const response = await getAllEnrollmentOfficers();
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setOfficers(data);
        setSearchForOfficer(data);
      } else if (response.status == 401) {
        RequestLogout();
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

  const showSwal = async (data) => {
    Swal.fire({
      title: "Are you sure you want to Remove?",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isDeleted = await handleDelete(data);
        if (isDeleted.status === 200) {
          Swal.fire("Success", isDeleted.data.message, "success").then(
            (result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            }
          );
        } else {
          Swal.fire("Error", "Something Went Wrong!", "success").then(
            (result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            }
          );
        }
      }
    });
  };
  const showAddAdminSwal = async (data) => {
    Swal.fire({
      title: "Continue?",
      text: "This officer will become an Admin and will be removed in the list.",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const response = await addAdmin(data._id);
          if (response.status === 200) {
            Swal.fire("Success", response.data.message, "success").then(
              (result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              }
            );
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong", "error");
          console.log(error);
        } finally {
          setIsLoading(false);
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
        return response;
      } else {
        console.error("Failed to delete Officer:", response);
        return response;
      }
    } catch (error) {
      console.error("Error deleting Officer:", error);
      return response;
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
      selector: (row) => row.name || " Account not yet activated",
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
          <p>
            {data.name ? (
              data.name
            ) : (
              <>
                Account not yet activated{" "}
                <MdLock style={{ fontSize: "1.1em", marginLeft: "5px" }} />
              </>
            )}
          </p>
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
      button: "true",
      width: "150px",
      cell: (data) => (
        <div
          style={{
            display: "flex",
            height: "60%",
            width: "100px",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button
            title="Promote as admin"
            style={{
              backgroundColor: "#2d55fb",
              padding: "5px ",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
            onClick={() => showAddAdminSwal(data)}
          >
            <FaUser fontSize="20px" />
          </button>
          <button
            title="Remove enrollment officer"
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
            title="Edit enrollment officer"
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
    height: "calc(100vh - 135px)",
    width: "100%",
    overflow: "hidden",
  };

  return (
    <>
      {isLoading ? <OvalLoader color="rgba(0, 0, 0, 0.304)" /> : ""}
      <OfficerModal
        trigger={trigger}
        triggerModal={setTrigger}
        initialOfficerData={initialOfficerData || {}}
        setInitialOfficerData={setInitialOfficerData}
      />
      <Header />
      <Upperbar
        userInfo={userInfo}
        currentPage="Enrollment Officer List"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="enrollmentOfficers"
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
                placeholder="Search via email"
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
