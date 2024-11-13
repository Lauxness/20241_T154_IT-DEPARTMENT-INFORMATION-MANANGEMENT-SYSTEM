import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import { googleAuth } from "../../../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function GoogleLogin({ triggerLogin, captchaCheck }) {
  const navigate = useNavigate();

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
    triggerLogin();
    localStorage.removeItem("_grecaptcha"); // Only if necessary
    captchaCheck();
    navigate("/");
  };

  const handleGoogleResponse = async ({ code }) => {
    if (!code) {
      return showSwal("Google authentication failed");
    }

    try {
      const result = await googleAuth(code);
      const { emailAddress, name, profilePicture, role, assignedYear } =
        result.data.user;
      const token = result.data.token;

      const userInfo = {
        emailAddress,
        name,
        token,
        profilePicture,
        role,
        assignedYear,
      };
      localStorage.setItem("user-info", JSON.stringify(userInfo));

      console.log("User Info:", userInfo);
      navigate("/home");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected error";
      console.error("Error from server:", errorMessage);
      showSwal(errorMessage);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: () => showSwal("Authentication process failed. Please try again."),
    flow: "auth-code",
  });

  return (
    <div>
      <GoogleButton onClick={googleLogin} />
    </div>
  );
}

export default GoogleLogin;
