import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import { googleAuth } from "../../../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function GoogleLogin(props) {
  const navigate = useNavigate();
  const showSwal = (error) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error,
      confirm: confirm(),
    });
  };
  const confirm = () => {
    props.triggerLogin();
    navigate("/");
  };
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        console.log(result);
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
      } else {
        throw new Error("Google authentication failed");
      }
    } catch (error) {
      console.error(
        "Error from server:",
        error.response ? error.response.data : error.message
      );
      showSwal(
        error.response ? error.response.data.message : "Unexpected error"
      );
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div>
      <GoogleButton onClick={googleLogin} />
    </div>
  );
}
export default GoogleLogin;
