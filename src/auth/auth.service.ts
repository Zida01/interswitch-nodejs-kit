import { LoggerUtils } from "../_lib/logger.utils";
import { IResponse, ResponseUtils } from "../_lib/response.utils";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { PrismaClient } from "@prisma/client";

const AuthPrismaClient = new PrismaClient().user;

export class authService {
  /**
   * @param  reqBody
   */

  LoginService(reqBody: LoginDto) {
    const { email, password } = reqBody;
    try {
    } catch (err) {
      LoggerUtils.error(err);
      return ResponseUtils.handleResponse(
        false,
        "Failed to process  login request",
        null
      );
    }
  }

    async RegisterService(reqBody: RegisterDto): Promise<IResponse<LoginDto | null>> {
        const { email, phoneNumber, password } = reqBody;
    try {
      const createdUser = await AuthPrismaClient.create({
        data: {
          email,
          phoneNumber,
          password, // should be hashed in production
        },
      });

    //   const response: LoginDto = {
    //     email: createdUser.email,
    //     password,
    //   };

      return ResponseUtils.handleResponse(
        true,
        "User registered successfully",
        createdUser
      );
    } catch (err) {
        LoggerUtils.error(err);
        return ResponseUtils.handleResponse(
          false,
          "Failed to process Register request",
          null
        );
    }
  }
}
