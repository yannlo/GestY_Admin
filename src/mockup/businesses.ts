// Base de données fictive d'entreprises
const now = new Date();

export const categories: Category[] = [
  { id: "cat-1", name: "Boutique", createdAt: now, updatedAt: now },
  { id: "cat-2", name: "Cave", createdAt: now, updatedAt: now },
  { id: "cat-3", name: "Cabine", createdAt: now, updatedAt: now },
  { id: "cat-4", name: "Dépôt", createdAt: now, updatedAt: now },
  { id: "cat-5", name: "Magasin", createdAt: now, updatedAt: now },
];

export const defaultActivities: Record<ActivityValue, boolean> = {
  retail: false,
  wholesale: false,
  transfer: false,
};

export const defaultOptions: Record<OptionValue, OptionState> = {
  deferredPayment: { state: false, activities: ["retail"] },
  sellerSaleEditing: { state: false },
  slateManagement: { state: false },
  consignmentManagement: { state: false, activities: ["wholesale", "retail"] },
};

export const mockBusinesses: Business[] = Array.from({ length: 20 }, (_, i) => {
  const id = `business-${i + 1}`;
  const categoryCount = (i % 3) + 1;
  const businessCategories = categories.slice(0, categoryCount);

  return {
    id,
    name: `Entreprise ${i + 1}`,
    categories: businessCategories,
    location:{ latitude: 5.36 + (i % 10) * 0.01, longitude: -4.01 + (i % 5) * 0.01 },
    activities: {
      ...defaultActivities,
      retail: i % 3 === 0,
      wholesale: i % 2 === 0,
      transfer: i % 5 === 0,
      id,
      createdAt: now,
      updatedAt: now,
    },
    options: {
      ...defaultOptions,
      deferredPayment: { state: i % 2 === 0, activities: ["retail"] },
      sellerSaleEditing: { state: i % 3 === 0 },
      slateManagement: { state: i % 5 === 0 },
      consignmentManagement: { state: i % 4 === 0, activities: ["wholesale", "retail"] },
      id,
      createdAt: now,
      updatedAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
});
