import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleButton from "react-google-button";
import GoogleLogin from "./GoogleLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style.css";

function LoginModal(props) {
  const [captcha, setCaptcha] = useState("");
  const [message, setMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const GoogleWrapper = (props) => (
    <GoogleOAuthProvider clientId="987401663151-s63q8ec4lvupoqjmman8l6v4g3da05jo.apps.googleusercontent.com">
      <GoogleLogin triggerLogin={props.triggerLogin} />
    </GoogleOAuthProvider>
  );

  const updateCaptcha = (val) => {
    setCaptcha(val);
  };

  const continueWithGoogle = async (val) => {
    updateCaptcha(val);
    const url = "http://localhost:8000/index/verifyCaptcha";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ captcha: val }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setMessage("");
        setCaptchaVerified(true);
      } else {
        setMessage(data.msg);
        setCaptchaVerified(false);
      }
    } catch (error) {
      console.error("Captcha verification failed:", error);
      setMessage("Captcha verification failed. Please try again.");
    }
  };

  return props.trigger ? (
    <div className="pop-up-container">
      <div className="pop-up-inner">
        <h2>Sign in with Google</h2>
        <ReCAPTCHA
          sitekey="6LcjQm0qAAAAADIuGQVgIIlFR_rtgpm0dcad97ly"
          onChange={continueWithGoogle} // Directly use `continueWithGoogle`
        />
        <div>{message}</div>
        {captchaVerified && <GoogleWrapper triggerLogin={props.triggerTask} />}
      </div>
    </div>
  ) : null;
}

export default LoginModal;
