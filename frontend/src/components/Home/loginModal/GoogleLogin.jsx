import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import { googleAuth } from "../../../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import OvalLoader from "../../loader/OvalLoader";

function GoogleLogin(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const showSwal = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    }).then(() => {
      confirmLogout();
    });
  };

  const confirmLogout = () => {
    props.striggerLogin();
    localStorage.removeItem("_grecaptcha");
    props.captchaCheck();
    navigate("/");
  };

  const handleGoogleResponse = async ({ code }) => {
    if (!code) {
      return showSwal("Google authentication failed");
    }
    setIsLoading(true);
    console.log(code);
    try {
      const result = await googleAuth(code);
      const {
        id,
        emailAddress,
        name,
        profilePicture,
        role,
        assignedYear,
        assignedProgram,
      } = result.data.user;
      const token = result.data.token;

      const userInfo = {
        id,
        emailAddress,
        name,
        token,
        profilePicture,
        role,
        assignedYear,
        assignedProgram,
      };
      console.log(userInfo);
      localStorage.setItem("user-info", JSON.stringify(userInfo));

      console.log("User Info:", userInfo);
      props.setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected error";
      console.error("Error from server:", errorMessage);
      showSwal(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: () => {
      setIsLoading(false);
      showSwal("Authentication process failed. Please try again.");
    },
    flow: "auth-code",
  });

  return (
    <>
      {isLoading && (
        <div>
          <OvalLoader color="rgba(0, 0, 0, 0.304)" />
        </div>
      )}
      <div>
        <GoogleButton
          onClick={() => {
            setIsLoading(true);
            googleLogin();
          }}
        />
      </div>
    </>
  );
}

export default GoogleLogin;
