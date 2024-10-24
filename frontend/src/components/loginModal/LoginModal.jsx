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
    const url = "http://localhost:3000/subscribe ";
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
            sitekey="6Lf_0mkqAAAAAE1-c_dX0-Z0AXrkGZ6CDHy3jTRy"
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
