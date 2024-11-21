import styles from "./style.module.css";
import { useEffect, useState } from "react";
import filePlaceholder from "../../assets/filePlaceholder.png";
import Profile from "./Profile";
import { uploadFile } from "../../api";
import OvalLoader from "../loader/OvalLoader";
import Swal from "sweetalert2";

function RequirementsPopup(props) {
  const [loading, setLoading] = useState(false);
  const [studentRequirements, setStudentRequirements] = useState([]);

  // Default requirements
  const defaultRequirements = [
    {
      requirementName: "Certificate of Good Moral",
      status: "Not yet submitted",
      fileThumbnailLink: filePlaceholder,
      fileViewLink: "",
      dateSubmitted: null,
    },
    {
      requirementName: "Vaccination Card",
      status: "Not yet submitted",
      fileThumbnailLink: filePlaceholder,
      fileViewLink: "",
      dateSubmitted: null,
    },
    {
      requirementName: "Report Card (FORM 138)",
      status: "Not yet submitted",
      fileThumbnailLink: filePlaceholder,
      fileViewLink: "",
      dateSubmitted: null,
    },
    {
      requirementName: "PSA Birth Certificate",
      status: "Not yet submitted",
      fileThumbnailLink: filePlaceholder,
      fileViewLink: "",
      dateSubmitted: null,
    },
    {
      requirementName: "BUKSU-CAT Result of Rating",
      status: "Not yet submitted",
      fileThumbnailLink: filePlaceholder,
      fileViewLink: "",
      dateSubmitted: null,
    },
  ];

  useEffect(() => {
    if (props.studentData) {
      const mergedRequirements = defaultRequirements.map((defaultReq) => {
        const existingReq = props.studentData.requirements?.find(
          (req) => req.requirementName === defaultReq.requirementName
        );
        return existingReq
          ? {
              ...defaultReq,
              ...existingReq,
              fileThumbnailLink:
                existingReq.fileThumbnailLink || defaultReq.fileThumbnailLink,
              dateSubmitted: existingReq.updatedAt || defaultReq.dateSubmitted,
            }
          : defaultReq;
      });
      console.log(mergedRequirements);
      setStudentRequirements(mergedRequirements);
    }
  }, [props.studentData]);

  const handleImageChange = async (e, requirementName) => {
    const file = e.target.files[0];
    setLoading(true);
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("requirement", file);
    formData.append("requirementName", requirementName);

    try {
      const currentId = props.studentData._id;
      const response = await uploadFile(currentId, formData);
      if (response.status === 200) {
        showSwal(true, response.data.message);
        setStudentRequirements((prev) =>
          prev.map((req) =>
            req.requirementName === requirementName
              ? {
                  ...req,
                  status: "Submitted",
                  dateSubmitted: new Date(),
                  fileThumbnailLink: response.data.fileThumbnailLink,
                  fileViewLink: response.data.fileViewLink,
                }
              : req
          )
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showSwal(false, "File upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const showSwal = (success, message) => {
    Swal.fire({
      icon: success ? "success" : "error",
      title: success ? message : "Oops...",
      text: success ? "" : message,
      showConfirmButton: true,
    });
  };

  return props.trigger ? (
    <>
      {loading && <OvalLoader />}
      <div className={styles.popUpContainer}>
        <div className={styles.popUpInner}>
          <Profile
            triggerRequirements={props.triggerRequirements}
            studentData={props.studentData}
          />
          <div className={styles.rightSide}>
            <div className={styles.header}>
              <p>Student requirements</p>
            </div>
            <div className={styles.requirementBody}>
              <div className={styles.design}></div>
              <div className={styles.requirementContainer}>
                {studentRequirements.map((requirement, index) => (
                  <form className={styles.requirement} key={index}>
                    <div className={styles.imageContainer}>
                      <img
                        src={requirement.fileThumbnailLink || filePlaceholder}
                        alt={requirement.requirementName || "Requirement"}
                      />
                    </div>
                    <div className={styles.requirementDetails}>
                      <div>
                        <p>Name: {requirement.requirementName}</p>
                        <p>
                          Status:{" "}
                          {requirement.fileId
                            ? "Submitted"
                            : "Not yet submitted"}
                        </p>
                        <p>
                          Date submitted:{" "}
                          {requirement.dateSubmitted
                            ? new Date(
                                requirement.dateSubmitted
                              ).toLocaleDateString()
                            : "Pending"}
                        </p>
                      </div>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id={`uploadImage-${index}`}
                        accept="image/png, image/jpeg, image/jpg"
                        name="requirement"
                        onChange={(e) =>
                          handleImageChange(e, requirement.requirementName)
                        }
                      />

                      {requirement.fileViewLink ? (
                        <a
                          href={requirement.fileViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.submitButton}
                          style={{ backgroundColor: "#2b9447" }}
                        >
                          View File
                        </a>
                      ) : (
                        <label
                          htmlFor={`uploadImage-${index}`}
                          style={{ backgroundColor: "#2d55fb" }}
                          className={styles.submitButton}
                        >
                          Upload Image
                        </label>
                      )}
                    </div>
                  </form>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}

export default RequirementsPopup;
