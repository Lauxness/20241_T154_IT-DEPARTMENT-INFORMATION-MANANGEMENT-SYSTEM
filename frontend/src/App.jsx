import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PageNotFound from "./pages/404PageNotFound";
import { useState } from "react";
import Home from "./pages/Home";
import EnrollmentOfficers from "./pages/EnrollmentOfficers";
import RefreshHandler from "./handler/RefreshHandler";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const PrivateRoute = ({ element }) => {
    const location = useLocation();
    return isAuthenticated ? element : <Navigate to={location.pathname} />;
  };
  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />

        <Route
          path="/enrollment_officers"
          element={<PrivateRoute element={<EnrollmentOfficers />} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
