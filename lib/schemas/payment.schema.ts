import { z } from "zod";

export const paymentFilterSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type PaymentFilterData = z.infer<typeof paymentFilterSchema>;
