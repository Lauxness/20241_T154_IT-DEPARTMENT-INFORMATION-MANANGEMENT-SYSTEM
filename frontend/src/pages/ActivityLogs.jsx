import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllActivities } from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import OvalLoader from "../components/loader/OvalLoader";
import Upperbar from "../components/Upperbar/Upperbar";
import { format } from "date-fns";
function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [searchForActivity, setSearchForActivity] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const fetchStudents = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);

    setUserInfo(userData);
    try {
      const response = await getAllActivities();
      if (response.status === 200) {
        const data = response.data;
        setActivityData(data);
        console.log(data);
        setSearchForActivity(data);
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns = [
    {
      name: "Officer Name",
      selector: (row) => row.officer.name,
      sortable: true,
    },
    { name: "Operation", selector: (row) => row.operation, sortable: true },
    {
      name: "Details",
      selector: (row) => row.details,
      sortable: true,
      description: true,
    },
    {
      name: "Date",
      selector: (row) => format(new Date(row.createdAt), "yyyy-MM-dd"),
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => format(new Date(row.createdAt), "HH:mm:ss"),
      sortable: true,
    },
    {
      name: "Student ID",
      selector: (row) => row.student.studentId,
      sortable: true,
    },
    {
      name: "Student Name",
      selector: (row) => row.student.studentName,
      sortable: true,
    },
  ];

  const searchHandler = (e) => {
    if (e === "") {
      setSearchForStudent(activityData);
      return;
    }
    const filteredData = activityData.filter((row) => {
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
        currentPage="Activity Logs"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="activityLogs"
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
            <div>Loading activities...</div>
          ) : (
            <DataTable
              columns={columns}
              data={searchForActivity}
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
