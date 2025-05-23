import { Oval } from "react-loader-spinner";

const OvalLoader = (props) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: "0",
          zIndex: "10",
          backgroundColor: props.color,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#2d55fb"
          secondaryColor="rgba(45, 85, 251, 0.2)"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </>
  );
};
export default OvalLoader;
