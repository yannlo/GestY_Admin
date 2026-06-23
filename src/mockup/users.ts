// Base de données fictive d'utilisateurs
export const mockUsers: User[] = [
  {
    id: "1",
    email: { isVerified: true, value: "admin@yannlo.com" },
    business: null,
    role: "admin",
    password: "yannlo",
    firstname: "Yann-Loïc",
    lastname: "Ehui",
    birthdate: new Date("1990-01-01"),
    gender: "M",
    phone: { isVerified: true, value: "0612345678" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
