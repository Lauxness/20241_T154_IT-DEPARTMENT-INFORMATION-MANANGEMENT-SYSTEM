import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./style.css";

function LoginModal(props) {
  return props.trigger ? (
    <>
      <div className="pop-up-container">
        <div className="pop-up-inner">
          <h4>Sign in with Google</h4>
          <ReCAPTCHA sitekey="6Lf_0mkqAAAAAE1-c_dX0-Z0AXrkGZ6CDHy3jTRy" />
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
export default LoginModal;
