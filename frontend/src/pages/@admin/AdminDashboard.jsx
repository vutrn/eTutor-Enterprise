import { useEffect } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

const AdminDashboard = () => {
  const { authUser } = useAuthStore();
  const { users, isUsersLoading, getAllUsers } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  console.log("users", users);

  return (
    <div className="">
      <h1>Admin Dashboard</h1>
      <div>NAME: {authUser.username}</div>
      <div className="student-list-placeholder">
      {isUsersLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {users && users.length > 0 ? (
              users.map((user) => (
                <div key={user.id}>
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                </div>
              ))
            ) : (
              <div>No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
