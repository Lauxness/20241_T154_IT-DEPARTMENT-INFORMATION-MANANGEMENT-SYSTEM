import styles from "./style.module.css";
import { useEffect, useState } from "react";
import filePlaceholder from "../../assets/filePlaceholder.png";
import Profile from "./Profile";
import { uploadFile, deleteRequirement, updateRequirement } from "../../api";
import OvalLoader from "../loader/OvalLoader";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Swal from "sweetalert2";

function RequirementsPopup(props) {
  const [loading, setLoading] = useState(false);
  const [studentRequirements, setStudentRequirements] = useState([]);

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
    if (props.selectedSemester !== props.currentSemester) {
      return Swal.fire(
        "Sorry",
        "You cant perform that here you need to be in the latest semester.",
        "error"
      );
    }
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
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showSwal(false, "File upload failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleImageChangeUpdate = async (e, reqId, requirementName) => {
    if (props.selectedSemester !== props.currentSemester) {
      return Swal.fire(
        "Sorry",
        "You cant perform that here you need to be in the latest semester.",
        "error"
      );
    }
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
      const response = await updateRequirement(currentId, reqId, formData);
      if (response.status === 200) {
        showSwal(true, response.data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showSwal(false, "File upload failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteRequirement = async (studentData, reqData) => {
    const id = studentData._id;
    const reqId = reqData._id;
    try {
      const response = await deleteRequirement(id, reqId);
      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  };

  const showDeleteSwal = async (studentData, reqData) => {
    if (props.selectedSemester !== props.currentSemester) {
      return Swal.fire(
        "Sorry",
        "You cant perform that here you need to be in the latest semester.",
        "error"
      );
    }
    Swal.fire({
      title: "Continue?",
      text: "This file will be removed permanently!",
      icon: "warning",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isDeleted = await handleDeleteRequirement(studentData, reqData);
        if (isDeleted.status === 200) {
          showSwal(true, isDeleted.data.message);
        } else {
          showSwal(false, isDeleted.data.message);
        }
      }
    });
  };

  const showSwal = (success, message) => {
    Swal.fire({
      icon: success ? "success" : "error",
      title: success ? "Success" : "Oops...",
      text: message,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        props.triggerRequirements();
      }
    });
  };

  return props.trigger ? (
    <>
      {loading && <OvalLoader color="rgba(0, 0, 0, 0.304)" />}
      <div className={styles.popUpContainer}>
        <div className={styles.popUpInner}>
          <Profile
            triggerRequirements={props.triggerRequirements}
            studentData={props.studentData}
            selectedSemester={props.selectedSemester}
            currentSemester={props.currentSemester}
          />
          <div className={styles.rightSide}>
            <div className={styles.header}>
              <p>Student requirements</p>
            </div>
            <div className={styles.requirementBody}>
              <div className={styles.design}>
                <Carousel
                  style={{ backgroundColor: "red" }}
                  showArrows={false}
                  dynamicHeight={false}
                  infiniteLoop={true}
                  autoPlay={true}
                  showThumbs={false}
                  interval={2000}
                >
                  <p className={styles.carouselItems}>
                    Bukidnon State University
                  </p>
                  <p className={styles.carouselItems}>College of Technology</p>
                  <p className={styles.carouselItems}>Information Technology</p>
                  <p className={styles.carouselItems}>
                    Entertainment And Multimedia
                  </p>
                  <p className={styles.carouselItems}>
                    Information Management System
                  </p>
                </Carousel>
              </div>
              <div className={styles.requirementContainer}>
                {studentRequirements.map((requirement, index) => (
                  <form className={styles.requirement} key={index}>
                    <div className={styles.imageContainer}>
                      <img
                        src={requirement.fileThumbnailLink || filePlaceholder}
                        alt={requirement.requirementName || "Requirement"}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.requirementDetails}>
                      <div className={styles.requirementStatus}>
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
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id={`updateImage-${index}`}
                        accept="image/png, image/jpeg, image/jpg"
                        name="requirement"
                        onChange={(e) =>
                          handleImageChangeUpdate(
                            e,
                            requirement._id,
                            requirement.requirementName
                          )
                        }
                      />

                      {requirement.fileViewLink ? (
                        <div
                          className={styles.actionContainer}
                          style={{ display: "flex" }}
                        >
                          <a
                            href={requirement.fileViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.submitButton}
                            style={{ backgroundColor: "#2b9447" }}
                          >
                            View File
                          </a>
                          <label
                            htmlFor={`updateImage-${index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.submitButton}
                            style={{ backgroundColor: "#2d55fb" }}
                          >
                            Update File
                          </label>
                          <a
                            onClick={() =>
                              showDeleteSwal(props.studentData, requirement)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.submitButton}
                            style={{ backgroundColor: "#f44960" }}
                          >
                            Remove File
                          </a>
                        </div>
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
