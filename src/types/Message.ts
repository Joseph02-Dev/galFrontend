import type { User } from "./User";

export interface Message {
  _id?: string;
  expediteur: string | User; // id ou objet User
  destinataire: string | User;
  contenu?: string;
  fichier?: string;
  typeFichier?: string;
  vu?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
