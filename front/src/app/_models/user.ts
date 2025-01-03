export interface Role {
  _id: string;
  type: string; // Type du rôle, par exemple "rh" ou "candidat"
  description?: string; // Description du rôle (facultatif)
  createdAt?: string; // Date de création (facultatif)
  updatedAt?: string; // Date de mise à jour (facultatif)
}

export interface User {
  _id: string; // Identifiant unique de l'utilisateur
  firstName: string; // Prénom de l'utilisateur
  lastName: string; // Nom de l'utilisateur
  email: string; // Adresse e-mail de l'utilisateur
  role: Role; // Rôle de l'utilisateur
  profileImage?: string; // Chemin ou URL de l'image de profil (facultatif)
  profileImageUrl?: string; // URL complète de l'image (facultatif, générée dynamiquement dans le frontend)
}
