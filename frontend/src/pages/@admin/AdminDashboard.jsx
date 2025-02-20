
import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, User } from "lucide-react";

const AdminDashboard = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <div className="flex justify-center items-center">
      <h1>Admin Dashboard</h1>
      NAME: {authUser.username}
      {/* Additional dashboard components or functionality can be added here */}
   
      {/* Placeholder for student list */}
      <div className="student-list-placeholder">
        {/* Future implementation for student list goes here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
