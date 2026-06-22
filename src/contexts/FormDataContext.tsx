import { createContext, useContext, useState, type ReactNode } from "react";

type FormDataContextType<T> = {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  updateFormData: <K extends keyof T>(key: K, value: T[K]) => void;
};

const FormDataContext = createContext<FormDataContextType<unknown> | null>(null);

export function FormDataProvider<T>({ children, defaultValue }: { children: ReactNode; defaultValue: T }) {
  const [formData, setFormData] = useState<T>(defaultValue);

  const updateFormData = <K extends keyof T>(key: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FormDataContext.Provider value={{ formData, setFormData, updateFormData } as FormDataContextType<unknown>}>
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData<T>(): FormDataContextType<T> {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context as FormDataContextType<T>;
}
