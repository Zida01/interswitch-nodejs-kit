import prisma from "../_lib/db/prisma";
import {IResponse, ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";
import {User} from "@prisma/client";


class UserService {

    findUserByEmailService = async (email: string): Promise<IResponse<User | null>> => {
        try {
            const user = await prisma.user.findUnique({where: {email}})
            return ResponseUtils.handleResponse(true, "User found", user);
        } catch (e) {
            LoggerUtils.error(e)
            return ResponseUtils.handleResponse(false, "User not found", null);
        }
    }
}
