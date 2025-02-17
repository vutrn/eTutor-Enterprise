import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser, isCheckingAuth, signup } = useAuthStore();

  useEffect(() => {
    console.log("useeffect");
    
  }, []);

  //  if (isCheckingAuth && !authUser)
  //   return (
  //     console.log("isCheckingAuth", isCheckingAuth, "authUser", authUser),
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader className="size-10 animate-spin" />
  //     </div>
  //   );

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
