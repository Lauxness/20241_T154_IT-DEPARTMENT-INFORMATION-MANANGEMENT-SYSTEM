import React from "react";
import "./style.css";

function LoginModal(props) {
  return props.trigger ? (
    <>
      <div className="pop-up-container">
        <div className="pop-up-inner"></div>
      </div>
    </>
  ) : (
    ""
  );
}
export default LoginModal;
