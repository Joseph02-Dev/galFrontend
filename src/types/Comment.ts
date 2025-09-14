import type { User } from "./User";

export interface Comment {
  _id?: string;
  auteur: string | User; // id ou objet User
  post: string; // id du post
  contenu: string;
  likes: string[]; // tableau d'id User
  createdAt?: string;
  updatedAt?: string;
}
