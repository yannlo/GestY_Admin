
const DEFAULT_USER: UserForm = {
  firstname: "",
  lastname: "",
  birthdate: new Date(),
  gender: "M",
  email: { isVerified: false, value: "" },
  phone: { isVerified: false, value: "" },
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
  account: {
    role: null,
    email: "",
    phone: "",
  },
} 



export { DEFAULT_USER, DEFAULT_BUSINESS }
