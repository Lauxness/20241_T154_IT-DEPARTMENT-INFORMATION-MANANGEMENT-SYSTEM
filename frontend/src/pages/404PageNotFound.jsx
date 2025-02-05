import NotFound from "../assets/404Notfound.png";
import Header from "../components/Header/Header";
const NotFoundPage = () => {
  const style = {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "start",
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
    outline: "none",
    borderRadius: "2px",
  };
  const navigate = () => {
    window.location.href = "http://localhost:5173/";
  };
  return (
    <>
      <div style={style}>
        <Header />
        <img src={NotFound} alt="illustration" />
        <h2>Page Not Found</h2>
        <button style={buttonStyle} onClick={navigate}>
          Back
        </button>
      </div>
    </>
  );
};

export default NotFoundPage;
