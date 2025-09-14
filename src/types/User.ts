export interface User {
  _id?: string; // ou id selon la réponse de l'API
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  pays: string;
  ville: string;
  phoneCode: string;
  phoneNumber: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}
