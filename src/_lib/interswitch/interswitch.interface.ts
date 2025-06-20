//Req Payload  for Initialize Endpoint
import {string} from "zod";

export interface InitializeCardPaymentReq {
    customerId: string
    amount: string
    currency: string
    authData: string
    transactionRef: string
}

//Resp From Initialize Endpoint
export interface ICardMakePaymentResp {
    transactionRef: string
    paymentId: string
    bankCode: string
    message: string
    amount: string
    responseCode: string //00, TO, SO,
    plainTextSupportMessage: string
}

//Resp from Authenticate Endpoint
export interface IAuthenticateOtpReq {
    paymentId: string,
    otp: string,
    transactionId: string,
}

export interface IAuthenticateOtpResp {
    transactionRef: string;
    bankCode: string;
    message: string
    transactionIdentifier: string
    amount: string
    responseCode: string; //'00',
    retrievalReferenceNumber: string
    stan: string
    terminalId: string
}

export interface ITransactionVerificationResp {

    Amount: string;
    CardNumber: string;
    MerchantReference: string
    PaymentReference: string
    RetrievalReferenceNumber: string
    Stan: string
    Channel: string;
    TerminalId: string;
    SplitAccounts: [];
    TransactionDate: string //'2025-06-19T12:19:52 PM',
    ResponseCode: '00'; //'00',
    ResponseDescription: string
    BankCode: string;
    PaymentId: string;
    RemittanceAmount: number
    PaymentCancelled: boolean

}

