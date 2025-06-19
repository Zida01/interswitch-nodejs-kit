import {z} from "zod";


export const initiatePaymentSchema = z.object({
    channel: z.string(),
    amount: z.string(),
    email: z.string().email(),
    pan: z.string(),
    pin: z.string().length(4),
    cvv2: z.string(),
    expireMonth: z.string().length(2),
    expireYear: z.string().length(2),
});

export type InitiatePaymentDto = z.infer<typeof initiatePaymentSchema>;