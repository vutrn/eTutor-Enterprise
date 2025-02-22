import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import AdminDashboard from "./pages/@admin/AdminDashboard";
import AdminLayout from "./pages/@admin/AdminLayout";
import StudentDashboard from "./pages/@student/StudentDashboard";
import TutorDashboard from "./pages/@tutor/TutorDashboard";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFound from "./pages/Other/NotFound";
import { useAuthStore } from "./store/useAuthStore";
import { useCallback, useEffect } from "react";

function App() {
  const { authUser, accessToken, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  const getDefaultRoute = () => {
    if (!authUser) return "/";
    switch (authUser.role) {
      case "admin":
        return "/admin";
      case "tutor":
        return "/tutor";
      case "student":
        return "/student";
      default:
        return "/";
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    // If not, redirect to login page
    if (!isCheckingAuth && (!authUser || !accessToken)) {
      navigate("/");
    }
  }, [authUser, accessToken, isCheckingAuth, navigate]);

  console.log("Auth user:", authUser);

  return (
    <>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={!authUser ? <LoginPage /> : <Navigate to={getDefaultRoute()} />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={authUser && authUser.role === "admin" ? <AdminLayout /> : <Navigate to="/" />}
        >
          <Route path="dashboard" index element={<AdminDashboard />} />
        </Route>

        {/* TUTOR */}
        <Route
          path="/tutor"
          element={authUser && authUser.role === "tutor" ? <TutorDashboard /> : <Navigate to="/" />}
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            authUser && authUser.role === "student" ? <StudentDashboard /> : <Navigate to="/" />
          }
        />

        {/* <Route path="/settings" element={<SettingPage />} /> */}
        {/* <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
