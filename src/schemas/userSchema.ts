import { z } from "zod";

const isAtLeast15YearsOld = (date: Date): boolean => {
  const today = new Date();

  let age = today.getFullYear() - date.getFullYear();

  const monthDiff = today.getMonth() - date.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < date.getDate())
  ) {
    age--;
  }

  return age >= 15;
};

export const authDataSchema = z.object({
  value: z.string(),
  isVerified: z.boolean(),
});

export const verifiedEmailSchema = z.object({
  value: z.string().email("Email invalide"),
  isVerified: z.literal(true, {
    message: "L'email doit être vérifié",
  }),
});

export const verifiedPhoneSchema = z.object({
  value: z
    .string()
    .regex(
      /^\d{10}$/,
      "Le téléphone doit contenir 10 chiffres",
    ),

  isVerified: z.literal(true, {
    message: "Le téléphone doit être vérifié",
  }),
});

export const userFormSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(
      3,
      "Le prénom doit contenir au moins 3 caractères",
    ),

  lastname: z
    .string()
    .trim()
    .min(
      3,
      "Le nom doit contenir au moins 3 caractères",
    ),

  birthdate: z.date().refine(
    isAtLeast15YearsOld,
    {
      message:
        "Vous devez avoir au moins 15 ans",
    },
  ),

  gender: z.enum(["M", "F", "O"]),

  email: verifiedEmailSchema,

  phone: verifiedPhoneSchema,

  status: z.enum([
    "active",
    "inactive",
    "suspended",
  ]),
});

export type UserFormValues = z.infer<
  typeof userFormSchema
>;