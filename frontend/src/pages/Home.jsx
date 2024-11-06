import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    console.log(userData);
    setUserInfo(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };

  return (
    <>
      <h1>Welcome {userInfo?.name}</h1>
      <h3>{`Email Address: ${userInfo?.emailAddress}`}</h3>
      <h3>{`Role: ${userInfo?.role}`}</h3>
      <h3>{`Assigned year: ${userInfo?.assignedYear}rd Year`}</h3>
      <img src={userInfo?.profilePicture} alt={userInfo?.name} />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
export default Home;
