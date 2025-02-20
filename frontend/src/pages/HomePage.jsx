import { LogOut, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <div>
      {/* PROFILE DETAILS */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <User className="h-4 w-4" />
            Full Name
          </div>
          <p className="bg-base-200 rounded-lg border px-4 py-2.5">{authUser?.username}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Mail className="h-4 w-4" />
            Email Address
          </div>
          <p className="bg-base-200 rounded-lg border px-4 py-2.5">{authUser?.email}</p>
        </div>
      </div>

      {authUser && (
        <>
          <Link to={"/profile"} className={`btn btn-sm gap-2`}>
            <User className="size-5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button className="flex items-center gap-2" onClick={logout}>
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;
