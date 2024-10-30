import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleButton from "react-google-button";
import "./style.css";

function LoginModal(props) {
  const [captcha, setCaptcha] = useState("");
  const [message, setMessage] = useState("");
  function navigate(url) {
    window.location.href = url;
  }
  const updateCaptcha = (val) => {
    setCaptcha(val);
  };
  async function oauth() {
    const response = await fetch("http://127.0.0.1:8000/google/request", {
      method: "post",
    });
    const data = await response.json();
    console.log(data.url);
    navigate(data.url);
  }

  const continueWithGoogle = () => {
    const url = "http://localhost:8000/index/verifyCaptcha";
    console.log(captcha);
    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ captcha: captcha }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          oauth();
        } else {
          setMessage(data.msg);
        }
      });
  };
  return props.trigger ? (
    <>
      <div className="pop-up-container">
        <div className="pop-up-inner">
          <h2>Sign in with Google</h2>
          <ReCAPTCHA
            sitekey="6LcjQm0qAAAAADIuGQVgIIlFR_rtgpm0dcad97ly"
            onChange={(val) => updateCaptcha(val)}
          />
          <div>{message}</div>
          <GoogleButton type="light" onClick={continueWithGoogle} />
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
export default LoginModal;
