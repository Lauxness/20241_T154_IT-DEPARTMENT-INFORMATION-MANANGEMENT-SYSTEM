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
import ArchivesStudents from "./pages/ArchivesStudents";
import FaQPage from "./pages/FaQ";
import ActivityLogs from "./pages/ActivityLogs";
import Notifications from "./pages/Notifications";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const PrivateRoute = ({ element }) => {
    console.log(isAuthenticated);
    return isAuthenticated ? element : <Navigate to="/" />;
  };
  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route
          path="/"
          element={<LandingPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route
          path="/enrollment_officers"
          element={<PrivateRoute element={<EnrollmentOfficers />} />}
        />
        <Route
          path="/archived_students"
          element={<PrivateRoute element={<ArchivesStudents />} />}
        />
        <Route
          path="/activity_logs"
          element={<PrivateRoute element={<ActivityLogs />} />}
        />
        <Route
          path="/notifications"
          element={<PrivateRoute element={<Notifications />} />}
        />
        <Route path="/faq" element={<PrivateRoute element={<FaQPage />} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
