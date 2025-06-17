import { LoggerUtils } from "../_lib/logger.utils";
import { IResponse, ResponseUtils } from "../_lib/response.utils";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const AuthPrismaClient = new PrismaClient().user;

export class authService {
  /**
   * @param  reqBody
   */

  async LoginService(
    reqBody: LoginDto
  ): Promise<IResponse<RegisterDto | null>> {
    const { email, password } = reqBody;
    try {
      const user = await AuthPrismaClient.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return ResponseUtils.handleResponse(
          false,
          "user account  invalid",
          null
        );
      }
      const checkPassword = await argon2.verify(user.password, password);
      if (!checkPassword) {
        return ResponseUtils.handleResponse(false, "invalid Credentials", null);
      }
      return ResponseUtils.handleResponse(
        true,
        "user login successfully ",
        user
      );
    } catch (err) {
      LoggerUtils.error(err);
      return ResponseUtils.handleResponse(
        false,
        "Failed to process  login request",
        null
      );
    }
  }

  async RegisterService(
    reqBody: RegisterDto
  ): Promise<IResponse<LoginDto | null>> {
    const { email, phoneNumber, password } = reqBody;
    try {
      const hashedPassword = await argon2.hash(password);
      const createdUser = await AuthPrismaClient.create({
        data: {
          email,
          phoneNumber,
          password: hashedPassword, // should be hashed in production
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
