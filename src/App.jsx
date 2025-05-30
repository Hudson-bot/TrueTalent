import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/GetHiredDashboard";
import PersonalInfoModal from "./components/getHired/PersonalInfoModal";
import LinkInfoModal from "./components/getHired/LinkInfoModal";
import SkillSelectModal from "./components/getHired/SkillSelectModal";
import HireDashboard from "./components/hire/HireDashboard";
import PostProject from "./components/hire/PostProject";
import HireProfile from "./components/hire/HireProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import LandingPage from "./pages/LandingPage/LandingPage";
import { useState, useEffect } from "react";
import "./App.css";
import CommunityPage from "./components/getHired/CommunityPage";
import ProjectSlider from "./components/getHired/ProjectSlider";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import { AuthProvider } from "./context/AuthContext";

// Wrapper for Dashboard to handle edit navigation
function DashboardWrapper({ personalInfo, linkInfo, skills }) {
  const navigate = useNavigate();
  return (
    <Dashboard
      personalInfo={personalInfo}
      linkInfo={linkInfo}
      skills={skills}
      onEditPersonal={() => navigate("/personal")}
      onEditLinks={() => navigate("/links")}
      onEditSkills={() => navigate("/skills")}
    />
  );
}

// ModalLayer shows over the dashboard when path matches
function ModalLayer({
  personalInfo,
  setPersonalInfo,
  linkInfo,
  setLinkInfo,
  skills,
  setSkills,
  isAuthenticated,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Create or fetch user ID on initial load
  useEffect(() => {
    if (!userId) {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
  }, [userId]);

  // Don't show modal on landing page or if not needed
  if (
    pathname === "/" ||
    !["/personal", "/links", "/skills"].includes(pathname)
  ) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      {pathname === "/personal" && (
        <PersonalInfoModal
          onSave={async (info) => {
            try {
              const res = await axios.post(
                "http://localhost:5000/api/personal-info",
                {
                  userId,
                  ...info,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setPersonalInfo(res.data);
              navigate("/links");
            } catch (err) {
              console.error("Failed to save personal info:", err);
              if (err.response?.status === 401) {
                navigate("/login");
              }
            }
          }}
          onClose={() => navigate("/gethired/dashboard")}
        />
      )}

      {pathname === "/links" && (
        <LinkInfoModal
          existingLinks={linkInfo}
          userId={userId}
          onSave={async (links) => {
            try {
              const response = await axios.put(
                `http://localhost:5000/api/users/${userId}/links`,
                links,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setLinkInfo(response.data);
              navigate("/skills");
            } catch (error) {
              console.error("Failed to save links:", error);
              if (error.response?.status === 401) {
                navigate("/login");
              }
            }
          }}
          onClose={() => navigate("/gethired/dashboard")}
          onBack={() => navigate("/personal")}
        />
      )}

      {pathname === "/skills" && (
        <SkillSelectModal
          existingSkills={skills}
          onSave={async (selectedSkills) => {
            try {
              await axios.post(
                "http://localhost:5000/api/skills",
                {
                  userId,
                  skills: selectedSkills,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setSkills(selectedSkills);
              navigate("/gethired/dashboard");
            } catch (error) {
              console.error("Error saving skills:", error);
              if (error.response?.status === 401) {
                navigate("/login");
              }
            }
          }}
          onClose={() => navigate("/gethired/dashboard")}
          onBack={() => navigate("/links")}
        />
      )}
    </div>
  );
}

function App() {
  const [personalInfo, setPersonalInfo] = useState({});
  const [linkInfo, setLinkInfo] = useState({});
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (response.data) {
          setIsAuthenticated(true);
          // Update email and role if not already set
          if (!localStorage.getItem("userEmail")) {
            localStorage.setItem("userEmail", response.data.email);
            setUserEmail(response.data.email);
          }
          if (!localStorage.getItem("userRole")) {
            localStorage.setItem("userRole", response.data.role);
            setUserRole(response.data.role);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setToken(null);
        setUserEmail(null);
        setUserRole(null);
      }
    };

    checkAuth();
  }, [token]);

  // Clear user data when token changes
  useEffect(() => {
    if (!token) {
      setPersonalInfo({});
      setLinkInfo({});
      setSkills([]);
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      setUserEmail(null);
      setUserRole(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  // Fetch user data from backend (personal info, links, and skills)
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const authToken = localStorage.getItem("token");

      if (!userId || !authToken) {
        setIsLoading(false);
        // Clear any existing data
        setPersonalInfo({});
        setLinkInfo({});
        setSkills([]);
        return;
      }

      try {
        // First verify the token is valid
        await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Continue with data fetching only if token is valid
        const personalRes = await axios.get(
          `http://localhost:5000/api/personal-info/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (personalRes.data) {
          setPersonalInfo(personalRes.data);
          setLinkInfo({
            github: personalRes.data.github || "",
            linkedin: personalRes.data.linkedin || "",
            resume: personalRes.data.resume || "",
          });
        }

        const skillsRes = await axios.get(
          `http://localhost:5000/api/skills/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (skillsRes.data && skillsRes.data.skills) {
          setSkills(skillsRes.data.skills);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          // Clear all auth data if unauthorized
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setToken(null);
          // Clear state data
          setPersonalInfo({});
          setLinkInfo({});
          setSkills([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (isLoading && location.pathname !== "/") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <ModalLayer
        personalInfo={personalInfo}
        setPersonalInfo={setPersonalInfo}
        linkInfo={linkInfo}
        setLinkInfo={setLinkInfo}
        skills={skills}
        setSkills={setSkills}
        isAuthenticated={isAuthenticated}
      />

      {/* <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/gethired/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/gethired/dashboard" /> : <Signup />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/personal" element={null} />
        <Route path="/links" element={null} />
        <Route path="/skills" element={null} />

        <Route
          path="/gethired/dashboard"
          element={
            <ProtectedRoute requiredRole="freelancer">
              <DashboardWrapper
                personalInfo={personalInfo}
                linkInfo={linkInfo}
                skills={skills}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectSlider />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hire/profile"
          element={
            <ProtectedRoute requiredRole="client">
              <HireProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hire/projects"
          element={
            <ProtectedRoute requiredRole="client">
              <HireDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hire/post-project"
          element={
            <ProtectedRoute requiredRole="client">
              <PostProject />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<Navigate to="/gethired/dashboard" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes> */}
      <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected routes for hiring clients */}
        <Route 
          path="/hire/*" 
          element={user?.role === 'hire' ? <HireLayout /> : <Navigate to="/login" />} 
        >
          <Route path="dashboard" element={<HireDashboard />} />
          <Route path="profile" element={<HireProfile />} />
          <Route path="post-project" element={<PostProject />} />
          <Route path="projects" element={<HireDashboard />} />
          <Route path="talents" element={<TalentDashboard />} />
        </Route>
        
        {/* Protected routes for talent/freelancers */}
        <Route 
          path="/talent/*" 
          element={user?.role === 'talent' ? <TalentLayout /> : <Navigate to="/login" />} 
        >
          <Route path="dashboard" element={<TalentDashboard />} />
          {/* Add other talent-specific routes */}
        </Route>
        
        {/* Default redirect based on role */}
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'hire' ? (
                <Navigate to="/hire/dashboard" />
              ) : (
                <Navigate to="/talent/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
    </div>
  );
}

// Wrap App with Router and AuthProvider at export
export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}