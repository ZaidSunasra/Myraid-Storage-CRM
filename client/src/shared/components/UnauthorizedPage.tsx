import { useNavigate } from "react-router";
import Falling from "@/assets/falling.svg"
import { useUser } from "@/context/UserContext";
import { navItems } from "@/utils/getNavigationLink";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const {user} = useUser();

  const goHome = () => {
    user ? navigate(navItems[user?.department][0].url) : navigate("/")
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-accent px-4 text-center">
      <img
        src={Falling}
        alt="Unauthorized Access"
        className="w-80 md:w-96 mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Oops! Unauthorized Access
      </h1>

      <p className="text-gray-600 mb-6">
        You’ve tried to access a page you don’t have permission for.
      </p>

      <button
        onClick={goHome}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default UnauthorizedPage;
