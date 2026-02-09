// schemas/checkout.ts
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

type TFunction = (key: string, params?: Record<string, any>) => string;

export const useCheckoutSchema = (t: TFunction) => {
  return toTypedSchema(
    z.object({
      cardHolder: z
        .string()
        .min(2, { message: t("validation.required") })
        .transform((val) => val.toUpperCase()),
      cardNumber: z
        .string()
        .regex(/^\d{16}$/, { message: "Visa format: 16 digits" }),
      expiryDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: "Format: MM/YY" }),
      cvv: z.string().regex(/^\d{3,4}$/, { message: "3-4 digits" }),
    }),
  );
};
