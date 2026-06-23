import { Region } from "react-native-maps";

const DEFAULT_USER: UserForm = {
  firstname: "",
  lastname: "",
  birthdate: new Date(),
  gender: "M",
  email: { isVerified: false, value: "" },
  phone: { isVerified: false, value: "" },
  status: "active",
};

const DEFAULT_OPTIONS: OptionsForm = {
  deferredPayment: { state: false, activities: ["retail"] },
  sellerSaleEditing: { state: false },
  slateManagement: { state: false },
  consignmentManagement: { state: false, activities: ["wholesale", "retail"] },
};

const DEFAULT_ACTIVITIES: ActivitiesForm = {
  retail: true,
  wholesale: false,
  transfer: false,
};


const DEFAULT_BUSINESS : BusinessForm = {
  name: "",
  categories: [],
  location: null,
  activities: DEFAULT_ACTIVITIES,
  options: DEFAULT_OPTIONS,
  status: "active",
  account: {
    role: null,
    email: "",
    phone: "",
  },
} 


const ABIDJAN_REGION: Region = {
  latitude: 5.36,
  longitude: -4.0083,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};



export { DEFAULT_USER, DEFAULT_BUSINESS, ABIDJAN_REGION }
