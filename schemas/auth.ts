import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

type TFunction = (key: string, params?: Record<string, any>) => string;

// --- 1. General Profile Schema ---
export const useGeneralSchema = (t: TFunction) => {
  return toTypedSchema(
    z.object({
      username: z.string().min(1, { message: t("validation.required") }),
      email: z
        .string()
        .min(1, { message: t("validation.required") })
        .email({ message: t("validation.email") }),
      avatar: z
        .union([
          z.literal(""),
          z.string().url({ message: t("validation.url") }),
        ])
        .optional(),
      phone: z.string().optional(),
      bio: z.string().max(500).optional(),
    }),
  );
};

// --- 2. Change Password Schema ---
export const usePasswordSchema = (t: TFunction) => {
  return toTypedSchema(
    z
      .object({
        currentPassword: z
          .string()
          .min(1, { message: t("validation.required") }),
        newPassword: z
          .string()
          .min(6, { message: t("validation.min", { min: 6 }) }),
        confirmPassword: z
          .string()
          .min(6, { message: t("validation.min", { min: 6 }) }),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: t("profile.error_password_match"),
        path: ["confirmPassword"],
      }),
  );
};

// --- 3. Login Schema ---
export const useLoginSchema = (t: TFunction) => {
  return toTypedSchema(
    z.object({
      email: z
        .string()
        .min(1, { message: t("validation.required") })
        .email({ message: t("validation.email") }),
      password: z.string().min(1, { message: t("validation.required") }),
    }),
  );
};

export const useRegisterSchema = (t: TFunction) => {
  return toTypedSchema(
    z.object({
      username: z.string().min(1, { message: t("validation.required") }),
      email: z
        .string()
        .min(1, { message: t("validation.required") })
        .email({ message: t("validation.email") }),
      password: z.string().min(6, { message: t("validation.min", { min: 6 }) }),
    }),
  );
};
