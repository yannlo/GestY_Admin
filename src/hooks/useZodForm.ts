import { useCallback, useMemo, useState } from "react";
import type { ZodTypeAny } from "zod";

export function useZodForm<T extends Record<string, unknown>>(
  formData: T,
  schema: ZodTypeAny,
) {
  const [dirty, setDirty] = useState<Partial<Record<string, boolean>>>({});

  const errors = useMemo<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    const parse = schema.safeParse(formData);
    if (!parse.success) {
      parse.error.issues.forEach(issue => {
        const path = issue.path.join(".");
        if (!result[path]) result[path] = issue.message;
      });
    }
    return result;
  }, [formData, schema]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const validateField = useCallback((key: string) => {
    setDirty(prev => ({ ...prev, [key]: true }));
  }, []);

  const validateAll = useCallback(() => {
    const allDirty = Object.keys(formData).reduce<Record<string, boolean>>((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setDirty(allDirty);
    return Object.keys(errors).length === 0;
  }, [formData, errors]);

  const getError = useCallback((path: string): string | undefined => {
    if (!dirty[path]) return undefined;
    const exact = errors[path];
    if (exact) return exact;
    const nested = Object.keys(errors).find(key => key.startsWith(`${path}.`));
    return nested ? errors[nested] : undefined;
  }, [dirty, errors]);

  return { errors, dirty, isValid, validateField, validateAll, getError };
}

export default useZodForm;
