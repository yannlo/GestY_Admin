import { mockUsers } from "@/mockup/users";

// Simulation de délai API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Service API pour les comptes

// Met à jour les informations de profil de l'utilisateur
export const updateUser = async (
  id: string,
  data: Partial<UserForm>,
): Promise<User | null> => {
  await delay(400);

  const index = mockUsers.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  const timestamp = new Date();

  const updated: User = {
    ...mockUsers[index],
    ...data,
    id,
    updatedAt: timestamp,
  };

  mockUsers[index] = updated;

  return {
    ...updated,
  };
};

// Met à jour le mot de passe de l'utilisateur
export const updatePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<{
  success: boolean;
  error?: string;
}> => {
  await delay(400);

  const index = mockUsers.findIndex((user) => user.id === id);

  if (index === -1) {
    return {
      success: false,
      error: "Utilisateur introuvable",
    };
  }

  if (mockUsers[index].password !== currentPassword) {
    return {
      success: false,
      error: "Mot de passe actuel incorrect",
    };
  }

  mockUsers[index].password = newPassword;
  mockUsers[index].updatedAt = new Date();

  return {
    success: true,
  };
};

// Met à jour les paramètres de connexion (2FA, services tiers)
export const updateAuthSettings = async (
  id: string,
  _settings: any,
): Promise<{
  success: boolean;
}> => {
  await delay(300);

  const index = mockUsers.findIndex((user) => user.id === id);

  if (index === -1) {
    return {
      success: false,
    };
  }

  // TODO: stocker les paramètres de connexion dans le modèle utilisateur si nécessaire
  mockUsers[index].updatedAt = new Date();

  return {
    success: true,
  };
};
