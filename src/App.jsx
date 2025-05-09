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
import axios from "axios";
import LandingPage from "./pages/LandingPage/LandingPage";
import { useState, useEffect } from "react";
import "./App.css";
import CommunityPage from "./components/getHired/CommunityPage";
import ProjectSlider from "./components/getHired/ProjectSlider";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
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
                }
              );
              setPersonalInfo(res.data);
              navigate("/links");
            } catch (err) {
              console.error("Failed to save personal info:", err);
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
                links
              );
              setLinkInfo(response.data);
              navigate("/skills");
            } catch (error) {
              console.error("Failed to save links:", error);
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
              await axios.post("http://localhost:5000/api/skills", {
                userId,
                skills: selectedSkills,
              });
              setSkills(selectedSkills);
              navigate("/gethired/dashboard");
            } catch (error) {
              console.error("Error saving skills:", error);
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
  const location = useLocation();

  // Set up axios defaults when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch user data from backend (personal info, links, and skills)
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const authToken = localStorage.getItem("token");

      if (!userId || !authToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch personal info
        const personalRes = await axios.get(
          `http://localhost:5000/api/personal-info/${userId}`
        );

        if (personalRes.data) {
          setPersonalInfo(personalRes.data);
          setLinkInfo({
            github: personalRes.data.github || "",
            linkedin: personalRes.data.linkedin || "",
            resume: personalRes.data.resume || "",
          });
        }

        // Fetch skills data
        try {
          const skillsRes = await axios.get(
            `http://localhost:5000/api/skills/${userId}`
          );

          if (skillsRes.data && skillsRes.data.skills) {
            setSkills(skillsRes.data.skills);
          }
        } catch (skillsError) {
          console.error("Error fetching skills:", skillsError);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          // Clear auth data if unauthorized
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setToken(null);
        } else if (error.response?.status === 404) {
          // Only remove userId if user not found
          localStorage.removeItem("userId");
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
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Profile setup routes */}
        <Route path="/personal" element={null} />
        <Route path="/links" element={null} />
        <Route path="/skills" element={null} />
        
        {/* GetHired (Talent) routes */}
        <Route
          path="/gethired/dashboard"
          element={
            <DashboardWrapper
              personalInfo={personalInfo}
              linkInfo={linkInfo}
              skills={skills}
            />
          }
        />
        <Route path = "/community" element={<CommunityPage />} />
        <Route path="/projects" element={<ProjectSlider />} />
        {/* Hire (Recruiter) routes */}
        <Route path="/hire/profile" element={<HireProfile />} />
        <Route path="/hire/projects" element={<HireDashboard />} />
        <Route path="/hire/post-project" element={<PostProject />} />
        
        {/* Redirects for old paths */}
        <Route path="/dashboard" element={<Navigate to="/gethired/dashboard" />} />
        
        {/* Redirect unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
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