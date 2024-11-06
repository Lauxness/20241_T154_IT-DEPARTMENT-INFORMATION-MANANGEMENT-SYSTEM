const NotFoundPage = () => {
  const style = {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px",
    width: "100vw",
    height: "100vh",
  };
  const buttonStyle = {
    width: "200px",
    height: "50px",
    color: "white",
    backgroundColor: "#2d55fb",
    fontSize: "1em",
    border: "none",
    borderRadius: "5px",
  };
  const navigate = () => {
    window.location.href = "http://localhost:5173/";
  };
  return (
    <>
      <div style={style}>
        <h1>404 Page Not Found</h1>
        <button style={buttonStyle} onClick={navigate}>
          Back
        </button>
      </div>
    </>
  );
};

export default NotFoundPage;
