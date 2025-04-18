import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const token = JSON.parse(data)?.token;

    if (token) {
      setIsAuthenticated(true);
      if (location.pathname === "/") {
        navigate("/home", { replace: true });
      }
    } else {
      setIsAuthenticated(false);
      navigate("/", { replace: true });
    }
  }, []);

  return null;
}

export default RefreshHandler;
