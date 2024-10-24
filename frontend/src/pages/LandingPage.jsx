import Header from "../components/Home/header/Header";
import Wave from "../components/Home/Waves/Wave";
import Content from "../components/Home/content/Content";
function LandingPage() {
  const height = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };
  const style1 = {
    position: "relative",
  };
  return (
    <>
      <div className="container" style={style1}>
        <div id="home" style={height}>
          <Wave />
          <Header />
          <Content />
        </div>
      </div>
    </>
  );
}
export default LandingPage;
