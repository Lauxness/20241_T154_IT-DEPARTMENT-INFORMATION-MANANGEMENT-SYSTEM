import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import Upperbar from "../components/Upperbar/Upperbar";
import Notification from "../components/Notification/Notification";
import { getNotifications } from "../api";
import OvalLoader from "../components/loader/OvalLoader";
function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState();
  const [loading, setLoading] = useState(true);
  const fetchUserInfo = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
  };
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.status === 200) {
        const notifs = response.data;

        setNotifications(notifs);
      }
      console.log("asdfsadfsdf", response.status);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
    fetchNotifications();
  }, []);

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
        currentPage="My Notifications"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="notifications"
          collapsed={collapsed}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {loading ? (
            <OvalLoader />
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                height: "100%",
                marginLeft: "20px",
                padding: "0 10px",
              }}
            >
              {notifications.length !== 0 ? (
                <Notification notifications={notifications} />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No notifications Yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
