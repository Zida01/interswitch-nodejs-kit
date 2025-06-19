import {z} from "zod";

export const authenticateOtpSchema = z.object({
    reference: z.string(),
    otp: z.string().length(6),
});

export type AuthenticateOtpDto = z.infer<typeof authenticateOtpSchema>;