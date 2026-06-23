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
  const status = i < 1 ? "suspended" : i < 4 ? "inactive" : "active";
  const baseAccountNumber = {
    owner: status !== "inactive" ? Math.floor(Math.random() * 7) + 1 : 0,
    manager: status !== "inactive" ? Math.floor(Math.random() * 7) + 1 : 0,
    seller: status !== "inactive" ? Math.floor(Math.random() * 7) + 1 : 0,
  };

  const totalProducts = status !== "inactive" ? Math.floor(Math.random() * 200) + 20 : 0;
  const generateProductStat = (): ProductStatBase => {
    if (totalProducts === 0) {
      return { available: 0, low: 0, outOfStock: 0, suspended: 0, total: 0 };
    }
    const available = Math.floor(Math.random() * totalProducts);
    const remaining = totalProducts - available;
    const low = Math.floor(Math.random() * remaining);
    const remaining2 = remaining - low;
    const outOfStock = Math.floor(Math.random() * remaining2);
    const suspended = remaining2 - outOfStock;
    return { available, low, outOfStock, suspended, total: totalProducts };
  };

  const generateTransferStat = (): TransferStat => {
    const total = status !== "inactive" ? Math.floor(Math.random() * 50) : 0;
    const available = total > 0 ? Math.floor(Math.random() * total) : 0;
    const suspended = total - available;
    return { available, suspended, total };
  };
  return {
    id,
    name: `Entreprise ${i + 1}`,
    categories: businessCategories,
    location: (() => {
      const zones = [
        { lat: 5.352, lng: -3.993 }, // Cocody Centre
        { lat: 5.383, lng: -3.976 }, // Angré
        { lat: 5.37, lng: -3.96 }, // Akouedo
      ];
      const zone = zones[i % 3];
      const angle = (i * 137.5 * Math.PI) / 180;
      const radius = 0.002 + Math.floor(i / 3) * 0.001;
      return {
        latitude: zone.lat + Math.cos(angle) * radius,
        longitude: zone.lng + Math.sin(angle) * radius,
      };
    })(),
    activities: {
      ...defaultActivities,
      ...(i % 3 === 0 || i % 2 === 0 || i % 5 === 0
        ? {
            retail: i % 3 === 0,
            wholesale: i % 2 === 0,
            transfer: i % 5 === 0,
          }
        : { retail: true }),
      id,
      createdAt: now,
      updatedAt: now,
    },
    options: {
      ...defaultOptions,
      deferredPayment: { state: i % 2 === 0, activities: ["retail"] },
      sellerSaleEditing: { state: i % 3 === 0 },
      slateManagement: { state: i % 5 === 0 },
      consignmentManagement: {
        state: i % 4 === 0,
        activities: ["wholesale", "retail"],
      },
      id,
      createdAt: now,
      updatedAt: now,
    },
    status,
    createdAt: now,
    updatedAt: new Date(now.getTime() + i * 60000), // Ajoute 1 minute par entreprise

    accountNumber: {
      ...baseAccountNumber,
      total:
        baseAccountNumber.manager +
        baseAccountNumber.owner +
        baseAccountNumber.seller,
    },
    productStat: {
      retail: generateProductStat(),
      wholesale: generateProductStat(),
    },
    transferStat: generateTransferStat(),
  };
});
