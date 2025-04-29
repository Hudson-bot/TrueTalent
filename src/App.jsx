import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
<<<<<<< HEAD
import Dashboard from "./Pages/Dashboard";
import PersonalInfoModal from "./components/PersonalInfoModal";
import LinkInfoModal from "./components/LinkInfoModal";
import SkillSelectModal from "./components/SkillSelectModal";
import HireDashboard from "./hire/HireDashboard";
import PostProject from "./hire/PostProject";
import HireProfile from "./hire/HireProfile";
import axios from "axios";
import LandingPage from "./Pages/LandingPage";
import { useState, useEffect } from "react";
import "./App.css";
=======
import PersonalInfoModal from "./components/PersonalInfoModal";
import LinkInfoModal from "./components/LinkInfoModal";
import SkillSelectModal from "./components/SkillSelectModal";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import { useState, useEffect } from "react";
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1

// Wrapper for Dashboard to handle edit navigation
function DashboardWrapper({ personalInfo, linkInfo, skills }) {
  const navigate = useNavigate();
<<<<<<< HEAD
=======

>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
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

<<<<<<< HEAD
// ModalLayer shows over the dashboard when path matches
=======
// ModalLayer always shows over the dashboard when path matches
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
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

<<<<<<< HEAD
  // Don't show modal on landing page or if not needed
  if (
    pathname === "/" ||
    !["/personal", "/links", "/skills"].includes(pathname)
  ) {
    return null;
  }
=======
  if (!["/personal", "/links", "/skills"].includes(pathname)) return null;
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1

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
<<<<<<< HEAD
          onClose={() => navigate("/gethired/dashboard")}
=======
          onClose={() => navigate("/dashboard")}
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
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
<<<<<<< HEAD
          onClose={() => navigate("/gethired/dashboard")}
=======
          onClose={() => navigate("/dashboard")}
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
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
<<<<<<< HEAD
              navigate("/gethired/dashboard");
=======
              navigate("/dashboard");
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
            } catch (error) {
              console.error("Error saving skills:", error);
            }
          }}
<<<<<<< HEAD
          onClose={() => navigate("/gethired/dashboard")}
=======
          onClose={() => navigate("/dashboard")}
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
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
<<<<<<< HEAD
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
=======

  // Fetch personal info from backend
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
        setIsLoading(false);
        return;
      }

      try {
<<<<<<< HEAD
        // Fetch personal info
        const personalRes = await axios.get(
          `http://localhost:5000/api/personal-info/${userId}`
        );

=======
        const personalRes = await axios.get(
          `http://localhost:5000/api/personal-info/${userId}`
        );
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
        if (personalRes.data) {
          setPersonalInfo(personalRes.data);
          setLinkInfo({
            github: personalRes.data.github || "",
            linkedin: personalRes.data.linkedin || "",
            resume: personalRes.data.resume || "",
          });
        }
<<<<<<< HEAD

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
=======
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 404) {
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
          localStorage.removeItem("userId");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
<<<<<<< HEAD
  }, [token]);

  if (isLoading && location.pathname !== "/") {
=======
  }, []);

  if (isLoading) {
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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

// Wrap App with Router at export
export default function AppWrapper() {  
  return (
    <Router>
      <App />
    </Router>
  );
}
=======
    <Router>
      <div className="relative min-h-screen bg-gray-100">
        <ModalLayer
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          linkInfo={linkInfo}
          setLinkInfo={setLinkInfo}
          skills={skills}
          setSkills={setSkills}
        />

        {/* Always show Dashboard */}
        <DashboardWrapper
          personalInfo={personalInfo}
          linkInfo={linkInfo}
          skills={skills}
        />

        <Routes>
          <Route 
            path="/" 
            element={<Navigate to={!personalInfo.name ? "/personal" : "/dashboard"} />} 
          />
          <Route path="/personal" element={null} />
          <Route path="/links" element={null} />
          <Route path="/skills" element={null} />
          <Route path="/dashboard" element={null} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
>>>>>>> 4735c7ce51407945510291d0fb3871457662add1
