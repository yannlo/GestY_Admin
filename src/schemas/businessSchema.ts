import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Le nom de la catégorie est obligatoire"),
  id: z.string().optional(),
});

export const activitiesFormSchema = z.object({
  retail: z.boolean(),
  wholesale: z.boolean(),
  transfer: z.boolean(),
});

const activityArraySchema = z.array(
  z.union([
    z.literal("retail"),
    z.literal("wholesale"),
    z.literal("transfer"),
  ]),
);

export const optionsFormSchema = z.object({
  deferredPayment: z.object({
    state: z.boolean(),
    activities: activityArraySchema.optional(),
  }),

  sellerSaleEditing: z.object({
    state: z.boolean(),
    activities: activityArraySchema.optional(),
  }),

  slateManagement: z.object({
    state: z.boolean(),
    activities: activityArraySchema.optional(),
  }),

  consignmentManagement: z.object({
    state: z.boolean(),
    activities: activityArraySchema.optional(),
  }),
});

export const accountSchema = z
  .object({
    role: z.enum(["owner", "manager_full"]).nullable(),
    email: z.string(),
    phone: z.string(),
  })
  .refine(
    (data) => data.role !== null,
    {
      message: "Veuillez sélectionner un type de compte",
      path: ["role"],
    },
  )
  .refine(
    (data) => data.email || data.phone,
    {
      message:
        "Renseignez au moins un email ou un numéro de téléphone",
    },
  )
  .refine(
    (data) =>
      !data.email ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),
    {
      message: "Email invalide",
      path: ["email"],
    },
  )
  .refine(
    (data) =>
      !data.phone ||
      /^\d{10}$/.test(data.phone),
    {
      message: "Numéro de téléphone invalide",
      path: ["phone"],
    },
  );

export const businessAccountSchema = z.object({
  account: accountSchema,
});

export const createBusinessBaseSchema = (
  availableActivities: ActivitiesForm,
) =>
  z.object({
    name: z.string().min(1, "Le nom est obligatoire"),

    categories: z
      .array(categoryFormSchema)
      .min(1, "Ajoutez au moins une catégorie"),

    location: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .nullable()
      .refine(
        (loc) => loc !== null,
        {
          message: "Ajoutez une localisation",
        },
      ),

    activities: activitiesFormSchema.refine(
      (acts) =>
        Object.keys(acts).some(
          (key) =>
            acts[key as ActivityValue] &&
            availableActivities[key as ActivityValue],
        ),
      {
        message:
          "Sélectionnez au moins un type d'activité",
      },
    ),

    options: optionsFormSchema,

    status: z.enum([
      "active",
      "inactive",
      "suspended",
    ]),

    account: z.any(),
  });

export const createBusinessFormSchema = (
  availableActivities: ActivitiesForm,
) =>
  createBusinessBaseSchema(
    availableActivities,
  ).extend(
    businessAccountSchema.shape,
  );

export type CreateBusinessFormValues = z.infer<
  ReturnType<typeof createBusinessFormSchema>
>;

export type BusinessAccountFormValues = z.infer<
  typeof businessAccountSchema
>;