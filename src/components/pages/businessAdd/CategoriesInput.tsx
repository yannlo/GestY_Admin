import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MultiSelectInput from "@/components/ui/Input/MultiSelectInput";
import { getCategories } from "@/services/businessApi";

export type CategoriesInputProps = {
  putFormToReady: () => void;
  categoriesForm: BusinessForm["categories"];
  setCategories: (categories: BusinessForm["categories"]) => void;
  required?: boolean;
  error?: string;
};

export default function CategoriesInput({
  putFormToReady,
  categoriesForm,
  setCategories,
  required,
  error,
}: CategoriesInputProps) {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const { data: categories = [], isSuccess: getCategoriesSucceed, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (getCategoriesSucceed) {
      setAvailableCategories(categories);
      putFormToReady();
    }
    if (!isLoading) {
      putFormToReady();
    }
  }, [getCategoriesSucceed, categories, putFormToReady, isLoading]);

  const buildCategories = (values: string[], availableCategories: Category[]): Category[] => {
    return values.map((val, index) => {
      const existing = availableCategories.find((c) => c.id === val);
      if (existing) return existing;
      const newCat = {
        id: `new-${Date.now()}-${index}`,
        name: val,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Category;
      setAvailableCategories(prev => [...prev, newCat]);
      return newCat;
    });
  };

  const categoryOptions = useMemo(
    () => availableCategories.map((c) => ({ label: c.name, value: c.id })),
    [availableCategories]
  );

  const selectedCategoryIds = useMemo(
    () => categoriesForm.map((c) => c.id).filter((id): id is string => id !== undefined),
    [categoriesForm]
  );

  return (
    <MultiSelectInput
      label="Catégorie"
      options={categoryOptions}
      value={selectedCategoryIds}
      onChange={(values) => setCategories(buildCategories(values, availableCategories))}
      creatable
      required={required}
      error={error}
    />
  );
}
