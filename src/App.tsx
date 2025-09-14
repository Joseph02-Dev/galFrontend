import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatPage from "./pages/usersChat";
import UsersPage from "./pages/usersPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <ProtectedRoute>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ChatPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Market />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Training />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirection si non connecté */}
        {/* Redirection catch-all vers /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
