import image_model1 from "../../../assets/Image1.png";
import { MdArrowRightAlt } from "react-icons/md";
import "./style.css";
function Content() {
  return (
    <>
      <div className="content">
        <div className="left-content">
          <div className="description">
            <div className="title">
              <p>
                A <span>centralized database</span> for students information in
                Bukidnon State University IT Department
              </p>
            </div>
            <div className="sub-title">
              <p>
                Our comprehensive solution to help enrollment officers organize
                student data and track student requirements seamlessly.
              </p>
            </div>
          </div>
          <div className="button-container">
            <button>
              Get Started <MdArrowRightAlt fontSize={"25px"} />
            </button>
            <a href="#features">
              <button>Explore more</button>
            </a>
          </div>
        </div>
        <div className="right-content">
          <div className="image-container">
            <img src={image_model1} />
          </div>
        </div>
      </div>
    </>
  );
}
export default Content;
