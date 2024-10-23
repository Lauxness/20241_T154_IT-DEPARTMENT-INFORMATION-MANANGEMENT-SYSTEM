import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleButton from "react-google-button";
import "./style.css";

function LoginModal(props) {
  return props.trigger ? (
    <>
      <div className="pop-up-container">
        <form className="pop-up-inner">
          <h2>Sign in with Google</h2>
          <ReCAPTCHA sitekey="6Lf_0mkqAAAAAE1-c_dX0-Z0AXrkGZ6CDHy3jTRy" />
          <GoogleButton
            type="light"
            onClick={() => {
              console.log("Google button clicked");
            }}
          />
        </form>
      </div>
    </>
  ) : (
    ""
  );
}
export default LoginModal;
