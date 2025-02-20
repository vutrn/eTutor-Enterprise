import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";

const TutorDashboard = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <div>
      <h1>Tutor Dashboard</h1>
      NAME: {authUser.username}
      {/* Additional dashboard components or functionality can be added here */}
      {/* For now, let's add a simple student list placeholder */}
      <button className="flex items-center gap-2" onClick={logout}>
        <LogOut className="size-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default TutorDashboard;
