import Header from "../components/Home/header/Header";
import Wave from "../components/Home/Waves/Wave";
import { Features } from "../components/Features/Features";
import { Developers } from "../components/Developers/Developers";
import { Projects } from "../components/About/Projects";
import { Contact } from "../components/Contact/Contact";
import Content from "../components/Home/content/Content";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function LandingPage() {
  const height = {
    height: "700px",
    display: "flex",
    flexDirection: "column",
  };
  const style1 = {
    position: "relative",
  };
  const location = useLocation();

  useEffect(() => {
    // Create a URLSearchParams object from the current location's search string
    const queryParams = new URLSearchParams(location.search);

    // Get the 'user' parameter
    const user = queryParams.get("user");

    if (user) {
      // Decode and parse the user data
      const parsedUser = JSON.parse(decodeURIComponent(user));
      console.log("Authenticated user:", parsedUser);
      // You can now use the parsedUser in your component state or UI
    }
  }, [location]);
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
