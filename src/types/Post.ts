import type { User } from "./User";
import type { Comment } from "./Comment";

export interface Post {
  _id?: string;
  auteur: string | User; // id ou objet User
  contenu: string;
  image?: string;
  likes: string[]; // tableau d'id User
  partages: string[]; // tableau d'id User
  createdAt?: string;
  updatedAt?: string;
}

// L'interface Comment est importée depuis ./Comment.ts

export interface PostInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'comment' | 'share';
  timestamp: Date;
}
