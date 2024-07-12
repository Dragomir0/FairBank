import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Adresse courriel requise.",
    })
    .email({
      message: "Adresse courriel invalide.",
    }),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Mot de passe doit contenir au moins 8 caractères.",
      })
      .regex(/[A-Z]/, {
        message: "Mot de passe doit contenir au moins une majuscule",
      })
      .regex(/[a-z]/, {
        message: "Mot de passe doit contenir au moins une minuscule",
      })
      .regex(/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/, {
        message: "Mot de passe doit contenir au moins un caractère spécial.",
      }),
    re_password: z.string(),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Les mots de passe ne sont pas identiques.",
    path: ["re_password"],
  });

const nameSchema = z.object({
  first_name: z.string().min(1, {
    message: "Prénom requis.",
  }),
  last_name: z.string().min(1, {
    message: "Nom requis.",
  }),
});

const birthdaySchema = z.object({
  birth_year: z.coerce
    .number({
      invalid_type_error: "Année invalide.",
    })
    .min(1900, "Année invalide.")
    .max(new Date().getFullYear(), "Année invalide"),

  birth_month: z.string({
    required_error: "Sélectionner le mois.",
  }),

  birth_day: z.coerce
    .number({ invalid_type_error: "Jour invalide." })
    .min(1, {
      message: "Jour invalide.",
    })
    .max(31, {
      message: "Jour invalide.",
    }),
});

const planSchema = z.object({
  plan: z.string().min(1, "Choisir un plan."),
});

export const signUpSchema = (step) => {
  switch (step) {
    case 1:
      return emailSchema;
    case 2:
      return passwordSchema;
    case 3:
      return nameSchema;
    case 4:
      return birthdaySchema;
    case 5:
      return planSchema;
  }
};
