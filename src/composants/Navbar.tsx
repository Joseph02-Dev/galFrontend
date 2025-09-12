
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <header className="fixed top-0 left-0 right-0 h-14 md:h-16 z-50" data-theme="night">
      <div className="h-full max-w-7xl mx-auto px-2 md:px-4 flex items-center justify-center gap-8">
        <Link to="/" className="font-extrabold text-lg md:text-xl flex-shrink-0 text-base-content">
          🌱 GlobalAgriLink
        </Link>
        {/* Zone de recherche : input sur desktop, icône sur mobile */}
        <div className="flex items-center mx-2 md:mx-4">
          <button className="block sm:hidden p-1.5 rounded text-base-content" title="Recherche">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <div className="hidden sm:block max-w-[220px] md:max-w-[320px] w-full">
            <input
              className="w-full rounded-full border border-white px-3 py-2 md:px-4 md:py-2 outline-none focus:ring focus:ring-green-200 text-sm md:text-base"
              placeholder="Recherche"
            />
          </div>
        </div>
        {/* Profil utilisateur à droite */}
        {user && (
          <div className="flex items-center gap-2">
            <img
              src={user.profileImage || "https://i.pravatar.cc/100"}
              alt="avatar utilisateur"
              className="w-9 h-9 rounded-full border object-cover"
            />
            <span className="font-medium text-base-content text-sm md:text-base whitespace-nowrap">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="ml-1 p-2 rounded-full hover:bg-red-100 text-red-600 transition"
            >
              <AiOutlineLogout className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
