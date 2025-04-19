import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import PersonalInfoModal from "./components/PersonalInfoModal";
import LinkInfoModal from "./components/LinkInfoModal";
import SkillSelectModal from "./components/SkillSelectModal";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import { useState, useEffect } from "react";

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

// ModalLayer always shows over the dashboard when path matches
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

  if (!["/personal", "/links", "/skills"].includes(pathname)) return null;

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
          onClose={() => navigate("/dashboard")}
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
          onClose={() => navigate("/dashboard")}
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
              navigate("/dashboard");
            } catch (error) {
              console.error("Error saving skills:", error);
            }
          }}
          onClose={() => navigate("/dashboard")}
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

  // Fetch personal info from backend
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 404) {
          localStorage.removeItem("userId");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
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
          <Route path="/" element={<Navigate to="/personal" />} />
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
