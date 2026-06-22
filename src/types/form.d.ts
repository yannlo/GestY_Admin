type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Options = OptionValue;

type UserForm = Omit<User,"role" | "business" | "password" | "id" | "createdAt"| "updatedAt">
type BusinessForm = Omit<Business, "id" | "createdAt" | "updatedAt" | "activities" | "options" | "categories" | "location"> & {
  activities: ActivitiesForm;
  options: OptionsForm;
  categories: CategoryForm[];
  location: Business["location"] | null;
  account: {
    role: null | Exclude<RoleValue, 'seller' | "manager_base" | "admin" >
    email: string
    phone: string
  }
};

type CategoryForm = Optional<Omit<Category, "createdAt" | "updatedAt">, "id">;
type ActivitiesForm = Omit<Business["activities"], "id" | "createdAt" | "updatedAt">;
type OptionsForm = Omit<Business["options"], "id" | "createdAt" | "updatedAt">;

