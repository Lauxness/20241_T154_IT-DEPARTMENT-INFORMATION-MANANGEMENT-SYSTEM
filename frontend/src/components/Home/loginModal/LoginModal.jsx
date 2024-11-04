import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleButton from "react-google-button";
import "./style.css";

function LoginModal(props) {
  const [captcha, setCaptcha] = useState("");

  const updateCaptcha = (val) => {
    setCaptcha(val);
  };

  const continueWithGoogle = () => {
    const url = "http://localhost:4000/subscribe";
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
          <GoogleButton type="light" onClick={continueWithGoogle} />
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
export default LoginModal;
