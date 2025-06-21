import axios from "axios";
import { InterSwitchCardService } from "./interswitch-card.service";
import { LoggerUtils } from "../../logger.utils";
import { IResponse, ResponseUtils } from "../../response.utils";
import { nameEnquiryReq } from "../interswitch.interface";

export class InterSwitchBankTransferService {
  private TranferServices: InterSwitchCardService;
  private getBankcodeUrl =
    "https://qa.interswitchng.com/quicktellerservice/api/v5/configuration/fundstransferbanks";
  private nameEnquiryUrl =
    "https://qa.interswitchng.com/quicktellerservice/api/v5/Transactions/DoAccountNameInquiry";
  private TerminalId = "3PBL0001";

  constructor() {
    this.TranferServices = new InterSwitchCardService();
  }

  async generateToken() {
    const token = this.TranferServices.generateTokenService();
    return token;
  }

  async getBankCode() {
    try {
      const token = await this.generateToken();
      const response = await axios({
        method: "GET",
        url: this.getBankcodeUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          TerminalID: this.TerminalId,
        },
      });
      return ResponseUtils.handleResponse(true, "Success", response.data);
    } catch (e: any) {
      LoggerUtils.error(e?.response?.data.errors);
      return ResponseUtils.handleResponse(false, e.response.data.errors, null);
    }
  }
  async nameEnquiry(nameEnquirydata: nameEnquiryReq): Promise<IResponse<nameEnquiryReq|null>> {
    try {
      const token = await this.generateToken();
      const response = await axios({
        method: "POST",
        url: this.nameEnquiryUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          TerminalID: this.TerminalId,
          bankcode: nameEnquirydata.bankCode,
          accountNumber: nameEnquirydata.accountNumber
        },
      });

      return ResponseUtils.handleResponse(true, "Success", response.data);
    } catch (e: any) {
      LoggerUtils.error(e?.response?.data.errors);
      return ResponseUtils.handleResponse(false, e.response.data.errors, null);
    }
  }
}
