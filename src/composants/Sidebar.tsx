import { Link, useNavigate } from "react-router-dom";
import { SiMarketo } from "react-icons/si";
import { BsNewspaper } from "react-icons/bs";
import { MdOndemandVideo } from "react-icons/md";
import { BellIcon, ChatBubbleOvalLeftIcon, Cog6ToothIcon, HomeIcon } from "@heroicons/react/24/outline";
import NotificationDropdown from "./NotificationDropdown";
import { getUnreadMessagesCount } from "../helpers/unreadMessages";
import { getUnreadNotificationsCount, markNotificationsAsSeen } from "../helpers/unreadNotifications";
import React from "react";


export default function Sidebar() {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const [notifCount, setNotifCount] = React.useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  React.useEffect(() => {
    if (user?.email) {
      setUnread(getUnreadMessagesCount(user.email));
      setNotifCount(getUnreadNotificationsCount(user.email));
    }
    const interval = setInterval(() => {
      if (user?.email) {
        setUnread(getUnreadMessagesCount(user.email));
        setNotifCount(getUnreadNotificationsCount(user.email));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  type User = {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");






  // Suggestions fictives (à remplacer par des vrais users si besoin)
  return (
    <aside
  className="w-50 overflow-y-auto"
      data-theme="night"
    >
      <div className="p-4 space-y-6">

        {/* Menu rapide */}
  <nav className="flex flex-col items-start gap-3 mb-10 w-full">
          {/* Accueil */}
          <div className="w-full flex justify-start">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content min-w-[180px]" title="Accueil">
              <HomeIcon className="w-7 h-7 md:w-8 md:h-8" />
              <span className="text-base font-medium">Accueil</span>
            </Link>
          </div>
          {/* Messagerie */}
          <div className="w-full flex justify-start">
            <Link to="/users" className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content min-w-[180px] relative" title="Messagerie">
              <ChatBubbleOvalLeftIcon className="w-7 h-7 md:w-8 md:h-8" />
              <span className="text-base font-medium">Messagerie</span>
              {unread > 0 && (
                <span className="absolute right-2 top-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          </div>
          {/* Notifications */}
          <div className="w-full flex justify-start">
            <div className="relative min-w-[180px]">
              <button
                className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content w-full"
                title="Notifications"
                onClick={() => {
                  if (user?.email) markNotificationsAsSeen(user.email);
                  setNotifCount(0);
                  setNotifOpen((v) => !v);
                }}
              >
                <BellIcon className="w-7 h-7 md:w-8 md:h-8" />
                <span className="text-base font-medium">Notifications</span>
                {notifCount > 0 && (
                  <span className="absolute right-2 top-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="fixed top-4 left-72 z-[9999] transition-transform duration-300 ease-out animate-slidein">
                  <NotificationDropdown onClose={() => setNotifOpen(false)} />
                </div>
              )}
            </div>
          </div>
          {/* Paramètres */}
          <div className="w-full flex justify-start">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content min-w-[180px]" title="Paramètres">
              <Cog6ToothIcon className="w-7 h-7 md:w-8 md:h-8" />
              <span className="text-base font-medium">Paramètres</span>
            </button>
          </div>
          {/* Fil d'actualité, Marché, Formation (icônes existantes) */}
          <div className="w-full flex justify-start">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content min-w-[180px]" title="Fil d'actualité">
              <BsNewspaper className="w-7 h-7 md:w-8 md:h-8"/>
              <span className="text-base font-medium">Fil d'actualité</span>
            </Link>
          </div>
          <div className="w-full flex justify-start">
            <Link to="/market" className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content min-w-[180px]" title="Marché">
              <SiMarketo className="w-7 h-7 md:w-8 md:h-8" />
              <span className="text-base font-medium">Marché</span>
            </Link>
          </div>
          <div className="w-full flex justify-start">
            <Link to="/training" className="flex items-center gap-3 px-4 py-3 rounded-lg btn btn-soft btn-warning hover:--color-info-content min-w-[180px]" title="Formation">
              <MdOndemandVideo className="w-7 h-7 md:w-8 md:h-8" />
              <span className="text-base font-medium">Formation</span>
            </Link>
          </div>
        </nav>

      </div>
    </aside>
  );
}

