import { useCallback, useMemo, useState } from "react";

export type ValidationRule<V> = {
  required?: boolean;
  requiredMessage?: string;
  validate?: (value: V) => string | undefined;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

type Errors<T> = Partial<Record<keyof T, string>>;
type Dirty<T> = Partial<Record<keyof T, boolean>>;

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function useFormValidation<T extends Record<string, unknown>>(
  formData: T,
  rules: ValidationRules<T>
) {
  const [dirty, setDirty] = useState<Dirty<T>>({});

  const validateValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]): string | undefined => {
      const rule = rules[key];
      if (!rule) return undefined;
      if (rule.required && isEmpty(value)) {
        return rule.requiredMessage ?? "Ce champ est obligatoire";
      }
      return rule.validate?.(value);
    },
    [rules]
  );

  const errors = useMemo<Errors<T>>(() => {
    const result: Errors<T> = {};
    (Object.keys(rules) as (keyof T)[]).forEach((key) => {
      const error = validateValue(key, formData[key]);
      if (error) result[key] = error;
    });
    return result;
  }, [formData, rules, validateValue]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const validateField = useCallback((key: keyof T) => {
    setDirty((prev) => ({ ...prev, [key]: true }));
  }, []);

  const validateAll = useCallback((): boolean => {
    const allDirty = (Object.keys(rules) as (keyof T)[]).reduce<Dirty<T>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {}
    );
    setDirty(allDirty);
    return Object.keys(errors).length === 0;
  }, [rules, errors]);

  const getError = useCallback(
    (key: keyof T): string | undefined => (dirty[key] ? errors[key] : undefined),
    [dirty, errors]
  );

  return {
    errors,
    dirty,
    isValid,
    validateField,
    validateAll,
    getError,
  };
}

export default useFormValidation;
