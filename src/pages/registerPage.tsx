import { useUser } from "../context/useUser";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function RegisterPage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
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
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
    pays: "",
    ville: "",
    phoneCode: "+224", // indicatif par défaut
    phoneNumber: "",
    profileImage: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "profileImage" && files && files[0]) {
      setFormData({ ...formData, profileImage: files[0] });
      setPreview(URL.createObjectURL(files[0])); // aperçu de la photo
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Prépare les données à envoyer (FormData si image)
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
  if (value && key !== "profileImage") data.append(key, value as string | Blob);
      });
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      await api.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // Après création, tenter de se connecter (backend ne renvoie pas nécessairement token)
      const loginRes = await api.post("/users/login", { email: formData.email, motDePasse: formData.motDePasse });
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      localStorage.setItem("token", loginRes.data.token);
      setUser(loginRes.data.user);
      navigate("/");
    } catch (err) {
      if (err && typeof err === "object" && err !== null && "response" in err) {
        setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur lors de l'inscription. Veuillez réessayer.");
      } else {
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-200" data-theme="night">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded shadow max-w-md mx-auto">
          {error}
        </div>
      )}
      {/* Carrousel d'images */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full p-8">
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
        <p className="mt-8 text-lg text-green-900 font-semibold text-center max-w-md">Inscrivez-vous pour rejoindre la communauté agricole, partager, vendre, apprendre et collaborer !</p>
      </div>
      {/* Formulaire */}
      <div className="shadow-lg rounded-lg p-6 w-full max-w-md bg-white/90" data-theme="caramellatte">
        <h2 className="text-2xl font-bold mb-4 text-center">Créer un compte</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Aperçu photo */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer">
              <img
                src={preview || "https://via.placeholder.com/100"}
                alt="Aperçu"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Ajouter une photo</p>
          </div>

          {/* Nom & Prénom */}
          <div className="flex gap-2">
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
              required
            />
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Mot de passe */}
          <input
            type="password"
            name="motDePasse"
            placeholder="Mot de passe"
            value={formData.motDePasse}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Numéro de téléphone */}
          <div className="flex gap-2">
            <select
              name="phoneCode"
              value={formData.phoneCode}
              onChange={handleChange}
              className="w-1/3 border p-2 rounded"
              required
            >
              <option value="+224">🇬🇳 +224 (Guinée)</option>
              <option value="+225">🇨🇮 +225 (Côte d’Ivoire)</option>
              <option value="+221">🇸🇳 +221 (Sénégal)</option>
              <option value="+223">🇲🇱 +223 (Mali)</option>
              <option value="+33">🇫🇷 +33 (France)</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Numéro de téléphone"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-2/3 border p-2 rounded"
              required
            />
          </div>

          {/* Pays */}
          <select
            name="pays"
            value={formData.pays}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Sélectionner un pays --</option>
            <option value="Guinée">Guinée</option>
            <option value="Côte d’Ivoire">Côte d’Ivoire</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Mali">Mali</option>
          </select>

          {/* Ville */}
          <input
            type="text"
            name="ville"
            placeholder="Ville actuelle"
            value={formData.ville}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Bouton */}
          <button
            type="submit"
            className="w-full  text-white p-2 rounded  transition btn btn-secondary"
          >
            S’inscrire
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Vous avez déjà un compte ?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 cursor-pointer"
          >
            Connectez-vous
          </span>
        </p>
        <p>-------------------Continuer avec-------------</p>
        <div className="flex flex-col gap-3 mt-2">
          
          {/* GitHub */}
          <button className="btn bg-black text-white border-black">
            <svg
              aria-label="GitHub logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              ></path>
            </svg>
            Login with GitHub
          </button>

          {/* Google */}
          <button className="btn bg-white text-black border-[#e5e5e5]">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>

          {/* Facebook */}
          <button className="btn bg-[#1A77F2] text-white border-[#005fd8]">
            <svg
              aria-label="Facebook logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
            >
              <path
                fill="white"
                d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
              ></path>
            </svg>
            Login with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
