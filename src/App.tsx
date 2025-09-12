import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ChatPage from "./pages/usersChat";
import UsersPage from "./pages/usersPage";
function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("user");
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Market from "./pages/Market";
import Training from "./pages/Training";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes accessibles SANS connexion */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes protégées */}
        <Route
          path="/users"
          element={
            <RequireAuth>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <MainLayout>
              <ChatPage />
            </MainLayout>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout>
                <Home />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <MainLayout>
                <Profile />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/market"
          element={
            <RequireAuth>
              <MainLayout>
                <Market />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/training"
          element={
            <RequireAuth>
              <MainLayout>
                <Training />
              </MainLayout>
            </RequireAuth>
          }
        />

        {/* Redirection si non connecté */}
      </Routes>
    </BrowserRouter>
  );
}
