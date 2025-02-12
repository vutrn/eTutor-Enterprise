import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/Auth/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'


function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    console.log("useeffect")
   }, [])

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
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage/> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster/>
    </>
  )
}

export default App
