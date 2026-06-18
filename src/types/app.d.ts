interface User {
  id: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: GenderValue;
  email: AuthData;
  phone: AuthData; // 10 digits
  password: string;
  createdAt: string;
}

type AuthData = {
    isVerified: boolean,
    value: string
}