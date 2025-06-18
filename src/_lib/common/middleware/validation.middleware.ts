import { ZodSchema, z } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validate = <T extends ZodSchema<any>>(schema: T): RequestHandler<
    any,
    any,
    z.infer<T>,
    any
> => {
    return (req: Request<any, any, z.infer<T>>, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.errors });
            return;
        }

        req.body = result.data;
        next(); // OK now
    };
};
