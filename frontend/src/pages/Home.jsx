import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const location = useLocation();
  let name;
  useEffect(() => {
    // Create a URLSearchParams object from the current location's search string
    const queryParams = new URLSearchParams(location.search);

    // Get the 'user' parameter
    const user = queryParams.get("user");

    if (user) {
      // Decode and parse the user data
      const parsedUser = JSON.parse(decodeURIComponent(user));
      name = parsedUser.name;
      console.log(name);
      console.log("Authenticated user:", parsedUser);
      // You can now use the parsedUser in your component state or UI
    }
  }, [location]);

  return <>Welcome to home page</>;
}
export default Home;
