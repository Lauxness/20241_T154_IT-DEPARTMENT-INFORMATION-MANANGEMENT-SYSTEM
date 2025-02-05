import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import SidebarComponent from "../components/Sidebar/sideBar";
import Upperbar from "../components/Upperbar/Upperbar";
import Faq from "react-faq-component";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const fetchUserInfo = async () => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const containerStyle = {
    display: "flex",
    height: "calc(100vh - 135px)",
    width: "100%",
    overflow: "hidden",
  };
  const data = {
    title: "Frequently Asked Questions.",
    rows: [
      {
        title: "What is the system about?",
        content: `The system is designed to manage and store student requirements efficiently. It acts as a centralized platform 
                  where institutions can securely store documents and other materials needed for administrative and academic purposes. 
                  The system streamlines processes, reduces paperwork, and ensures that all requirements are well-organized and 
                  easily accessible when needed.`,
      },
      {
        title: "How do I add a student to the system?",
        content: `To add a student, navigate to the "Students" page. Click on "Add Student" and fill in the required details 
                  such as the student’s name, ID number, and basic information. Once all fields are completed, click "Confirm" to securely 
                  add the student to the database.`,
      },
      {
        title: "How do I add student requirements?",
        content: `To add student requirements, go to the "Students" page of the system. Select the student from the list or 
                  search for their name. Then, upload the required documents. And then i will automatically store to the database and also store it to centralized google drive. `,
      },
      {
        title: "What kind of requirements can be stored in the system?",
        content: `The system allows you to store various types of student requirements, such as:
                  - Images of PSA (Philippine Statistics Authority documents)
                  - Vaccination Card
                  - BUKSU-CAT (Bukidnon State University College Admission Test) Result of Rating
                  - Report Card (Form 138)
                  - Certificate of Good Moral
                  These requirements are securely saved and categorized for easy management.`,
      },
      {
        title: "What are the security measures of the system?",
        content: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: "500", marginBottom: "10px" }}>
              The system includes several security features to protect sensitive
              data:
            </p>
            <p>
              -Data Encryption: All stored information is encrypted to ensure
              privacy and security.
            </p>
            <p>
              - User Authentication: Only authorized users with valid
              credentials can access the system.
            </p>
            <p>
              - Role-Based Access Control: Different user roles are defined with
              specific permissions to ensure restricted access.
            </p>
            <p>
              - Regular Backups: Data is backed up regularly to prevent loss in
              case of technical issues.
            </p>
            These measures ensure the safety and confidentiality of all student
            requirements.
          </div>
        ),
      },
      {
        title: "What is the current version of the system?",
        content: <p>The current version of the system is 1.0.0.</p>,
      },
    ],
  };

  const styles = {
    titleTextColor: "black",
    rowTitleColor: "black",
    rowTitleTextSize: "16px",
    rowContentPaddingTop: "10px",
    rowContentPaddingBottom: "10px",
  };

  const config = {
    animate: true,
    tabFocus: true,
  };
  return (
    <>
      <Header />
      <Upperbar
        userInfo={userInfo}
        currentPage="Frequently Asked Questions"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div style={containerStyle}>
        <SidebarComponent
          userInfo={userInfo}
          currentPage="faq"
          collapsed={collapsed}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginLeft: "20px",
            marginTop: "5px",
            padding: "10px",
          }}
        >
          <Faq data={data} styles={styles} config={config} />
        </div>
      </div>
    </>
  );
}

export default Home;
