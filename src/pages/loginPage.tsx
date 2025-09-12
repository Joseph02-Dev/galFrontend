
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  // Images illustrant l'agritech
  const images = [
    '/assets/agri1.jpg',
    '/assets/agri2.jpg',
    '/assets/agri3.jpg',
    '/assets/agri4.jpg',
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérification dans la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-200" >
      {/* Carrousel d'images */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full p-8" data-theme="night">
        <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
          {images.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="illustration agriculture"
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${current === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{transitionProperty: 'opacity'}}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {images.map((_, idx) => (
            <span key={idx} className={`w-3 h-3 rounded-full ${current === idx ? 'bg-green-600' : 'bg-green-200'} block transition-all`}></span>
          ))}
        </div>
        <p className="mt-8 text-lg text-green-900 font-semibold text-center max-w-md">Connectez-vous pour rejoindre la communauté agricole, partager, vendre, apprendre et collaborer !</p>
      </div>
      {/* Formulaire */}
      <div className="p-6 shadow-xl rounded-xl w-full max-w-md bg-white/90" data-theme="caramellatte">
        <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border rounded px-3 py-2 text-{--color-warning}"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full  text-white py-2 rounded font-semibold btn btn-secondary"
          >
            Se connecter
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-accent">
          Pas de compte ?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
