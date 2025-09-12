export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  followers: string[]; // tableau d'id utilisateur
  following: string[]; // tableau d'id utilisateur
}
