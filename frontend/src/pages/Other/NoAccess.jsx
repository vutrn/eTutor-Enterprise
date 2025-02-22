import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const NoAccess = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   toast.error("Redirecting back...");
  //   const timeoutId = setTimeout(() => {
  //     navigate(-1);
  //   }, 3000);

  //   return () => clearTimeout(timeoutId);
  // }, [navigate]);

  return (
    <div className="flex justify-center items-center flex-col min-h-screen gap-5">
      <h1 className="text-red-500 text-5xl">No Access</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default NoAccess;
