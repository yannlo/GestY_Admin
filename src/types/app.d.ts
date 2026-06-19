interface User {
  id: string;
  role: RoleValue;
  business: Business|null;
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: GenderValue;
  email: AuthData;
  phone: AuthData; // 10 digits
  password: string;
  createdAt: string;
}

interface Business {
  name : string
}

type AuthData = {
    isVerified: boolean,
    value: string
}