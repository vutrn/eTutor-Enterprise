import { useEffect } from "react";
import notfound from "../../assets/notfound.jpg";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const NotFound = () => {
  const navigate = useNavigate();

  // Display toast message

  useEffect(() => {
    toast.error("Page not found. Redirecting back...");
    const timeoutId = setTimeout(() => {
      navigate(-1);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center">
      <img src={notfound} alt="Not Found" style={{ width: "50%" }} />
    </div>
  );
};

export default NotFound;
