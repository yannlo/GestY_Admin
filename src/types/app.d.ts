import { LatLng } from "react-native-maps";

declare global {
  interface IdData {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface User extends IdData {
    role: RoleValue;
    business: {id: string} & Partial<Business> | null;
    firstname: string;
    lastname: string;
    birthdate: Date;
    gender: GenderValue;
    email: AuthData;
    phone: AuthData; // 10 digits
    password: string;
  }

  interface Business extends IdData {
    name: string;
    categories: Category[];
    location: LatLng;
    activities: Record<ActivityValue, boolean> & IdData;
    options: Record<Options, OptionState> & IdData;
  }

  interface Category extends IdData{
    name: string;
  }


  interface ActivityState {
    available: boolean;
    value: boolean;
  }
    interface OptionState {
    state: boolean;
    activities?: ActivityValue[];
  }

  type AuthData = {
    isVerified: boolean;
    value: string;
  };
}

export {};
