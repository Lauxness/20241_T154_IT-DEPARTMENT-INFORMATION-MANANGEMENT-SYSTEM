import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAllActivities } from "../api";
import DataTable from "react-data-table-component";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import SearchBar from "material-ui-search-bar";
import OvalLoader from "../components/loader/OvalLoader";
import TimeLine from "../components/Timelines/Timelines";
import Upperbar from "../components/Upperbar/Upperbar";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [searchForActivity, setSearchForActivity] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const fetchActivities = async () => {
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
        RequestLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const RequestLogout = () => {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "Your Session Expired. Please Login again",
    }).then(() => {
      localStorage.removeItem("user-info");
      navigate("/"); // Navigate after alert
    });
  };
  const searchHandler = (e) => {
    if (e === "") {
      setSearchForActivity(activityData);
      return;
    }
    const filteredData = Object.entries(activityData).reduce(
      (acc, [date, logs]) => {
        if (date.includes(e)) {
          acc[date] = logs;
        } else {
          const filteredLogs = logs.filter((log) => {
            return false;
          });
          if (filteredLogs.length > 0) {
            acc[date] = filteredLogs;
          }
        }
        return acc;
      },
      {}
    );

    setSearchForActivity(filteredData);
    console.log("Filtered Data:", filteredData);
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
                placeholder="Search for date format (YYYY-MM-DD)"
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
            <TimeLine groupedLogs={searchForActivity} />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
