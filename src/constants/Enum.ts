export const GENDERS: Gender[] = [
  { label: "Homme", value: "M" },
  { label: "Femme", value: "F" },
  { label: "Autre", value: "O" },
];

export const ROLES: Role[] = [
  { label: "Propriétaire", value: "owner" },
  { label: "Manager", value: "manager_base" },
  { label: "Manager", value: "manager_full" },
  { label: "Vendeur", value: "seller" },
];

export const ACTIVITIES: Activity[] = [
  { label: "Détail", value: "retail" },
  { label: "Gros", value: "wholesale" },
  { label: "Transfert", value: "transfer" },
];

export const OPTIONS: Option[] = [
  { label: "Paiement différé", value: "deferredPayment" },
  { label: "Modification de vente par un vendeur", value: "sellerSaleEditing" },
  { label: "Gestion des consignations", value: "consignmentManagement" },
  { label: "Gestion des ardoises", value: "slateManagement" },
];

export const STATUSES: Status[] = [
  { label: "Actif", value: "active" },
  { label: "Suspendu", value: "suspended" },
  { label: "Inactif", value: "inactive" },
];

export const PRODUCT_STATUES: ProductStatus[] = [
  { label: "Disponible", value: "available" },
  { label: "Insuffisant", value: "low" },
  { label: "En rupture", value: "outOfStock" },
  { label: "Suspendu", value: "suspended" },
];


export const TRANSFER_STATUES: ProductStatus[] = [
  { label: "Disponible", value: "available" },
  { label: "Suspendu", value: "suspended" },
];
