import Header from "../components/Home/header/Header";
import Wave from "../components/Home/Waves/Wave";
import { Features } from "../components/Features/Features";
import { Developers } from "../components/Developers/Developers";
import { Projects } from "../components/About/Projects";
import { Contact } from "../components/Contact/Contact";
import Content from "../components/Home/content/Content";
function LandingPage() {
  const height = {
    height: "700px",
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
        <div id="Features">
          <Features />
        </div>
        <div id="Developers">
          <Developers />
        </div>
        <div id="Developers">
          <Projects />
        </div>
        <div id="Developers">
          <Contact />
        </div>
      </div>
    </>
  );
}
export default LandingPage;
