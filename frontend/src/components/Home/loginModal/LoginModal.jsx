import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLogin from "./GoogleLogin";
import { Oval } from "react-loader-spinner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style.css";

function LoginModal(props) {
  const [captcha, setCaptcha] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const GoogleWrapper = (props) => (
    <GoogleOAuthProvider clientId="987401663151-s63q8ec4lvupoqjmman8l6v4g3da05jo.apps.googleusercontent.com">
      <GoogleLogin
        triggerLogin={props.triggerLogin}
        captchaCheck={captchaCheck}
        setIsAuthenticated={props.setIsAuthenticated}
      />
    </GoogleOAuthProvider>
  );
  const captchaCheck = () => {
    if (captchaVerified) {
      setCaptchaVerified(false);
    } else {
      setCaptchaVerified(true);
    }
  };
  const captchaHandler = async (val) => {
    const url = "http://localhost:8000/index/verifyCaptcha";
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ captcha: val }),
      });
      const data = await response.json();
      console.log(data.success);
      if (data.success) {
        setMessage("");
        captchaCheck();
      } else {
        setMessage(data.msg);
        captchaCheck();
      }
    } catch (error) {
      console.error("Captcha verification failed:", error);
      setMessage("Captcha verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleModalClose = () => {
    setCaptchaVerified(false);
    props.triggerTask();
  };
  return props.trigger ? (
    <div className="pop-up-container" onClick={() => handleModalClose()}>
      <div className="pop-up-inner" onClick={(e) => e.stopPropagation()}>
        <h2>Sign in with Google</h2>
        <ReCAPTCHA
          sitekey="6LcjQm0qAAAAADIuGQVgIIlFR_rtgpm0dcad97ly"
          onChange={captchaHandler}
        />
        {isLoading ? (
          <Oval
            visible={true}
            height="30"
            width="30"
            color="#2d55fb"
            secondaryColor="rgba(45, 85, 251, 0.2)"
            ariaLabel="oval-loading"
          />
        ) : (
          ""
        )}
        <div>{message}</div>
        {captchaVerified && (
          <GoogleWrapper
            triggerLogin={props.triggerTask}
            setIsAuthenticated={props.setIsAuthenticated}
          />
        )}
      </div>
    </div>
  ) : null;
}
export default LoginModal;
