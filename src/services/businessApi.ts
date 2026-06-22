import { mockBusinesses, categories } from "@/mockup/businesses";
import type { LatLng } from "react-native-maps";

// Simulation de délai API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Service API pour les entreprises

export const listBusinesses = async (): Promise<Business[]> => {
  await delay(300);
  return mockBusinesses.map((b) => ({ ...b }));
};

export const getCategories = async (): Promise<Category[]> => {
  await delay(200);
  return categories.map((c) => ({ ...c }));
};

export const getBusiness = async (id: string): Promise<Business | null> => {
  await delay(200);
  const business = mockBusinesses.find((b) => b.id === id);
  return business ? { ...business } : null;
};

export const createBusiness = async (data: BusinessForm): Promise<Business> => {
  await delay(400);
  const id = `business-${mockBusinesses.length + 1}-${Date.now()}`;
  const timestamp = new Date();

  const newBusiness: Business = {
    ...data,
    location: data.location as LatLng,
    id,
    categories: data.categories.map((category) => ({
      ...category,
      id: category.id ?? `category-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
    activities: {
      ...data.activities,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    options: {
      ...data.options,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  mockBusinesses.push(newBusiness);
  return { ...newBusiness };
};

export const updateBusiness = async (id: string, data: BusinessForm): Promise<Business | null> => {
  await delay(400);
  const index = mockBusinesses.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const timestamp = new Date();
  const updated: Business = {
    ...data,
    location: data.location as LatLng,
    id,
    categories: data.categories.map((category) => {
      const existing = mockBusinesses[index].categories.find((c) => c.id === category.id);
      return {
        ...category,
        id: category.id ?? `category-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };
    }),
    activities: {
      ...data.activities,
      id,
      createdAt: mockBusinesses[index].activities.createdAt,
      updatedAt: timestamp,
    },
    options: {
      ...data.options,
      id,
      createdAt: mockBusinesses[index].options.createdAt,
      updatedAt: timestamp,
    },
    createdAt: mockBusinesses[index].createdAt,
    updatedAt: timestamp,
  };

  mockBusinesses[index] = updated;
  return { ...updated };
};

export const deleteBusiness = async (id: string): Promise<boolean> => {
  await delay(300);
  const index = mockBusinesses.findIndex((b) => b.id === id);
  if (index === -1) return false;
  mockBusinesses.splice(index, 1);
  return true;
};
