import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const NoAccess = () => {
  const navigate = useNavigate();

  
  useEffect(() => {
    toast.error("Page not found. Redirecting back...");
    const timeoutId = setTimeout(() => {
      navigate(-1);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);
  return (
    <div className="flex justify-center items-center">
      <div>
        No Access - You do not have permission to view this page.
        <p>You will be redirected shortly...</p>
      </div>
    </div>
  );
};

export default NoAccess;
