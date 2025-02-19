import { Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { authUser } = useAuthStore();
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
    </div>
  );
};

export default HomePage;
