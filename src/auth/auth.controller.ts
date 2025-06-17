import express, { Request, Response } from 'express'
import { ResponseUtils } from '../_lib/response.utils'
import { LoggerUtils } from '../_lib/logger.utils'
import { authService } from './auth.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'



export class authController {
  /**
   * @description : Initiate payment
   * @param req
   * @param res
   */
  private Authservice: authService;

  constructor() {
    this.Authservice = new authService();
  }
    Register =  async (req: Request<{}, {}, RegisterDto>, res: Response): Promise<any> => {
        const{email,password, phoneNumber}= req.body
    try {
      const result =   await  this.Authservice.RegisterService(req.body);
      res.status(200).json(result);
    } catch (err) {
        LoggerUtils.error(err);
        res
          .status(400)
          .json(
            ResponseUtils.handleResponse(
              false,
              "Unable to process request",
              null
            )
          );
    }
  };
}