//Req Payload  for Initialize Endpoint
export interface InitializeCardPaymentReq{
    customerId: string
    amount: string
    currency: string
    authData:string
    transactionRef: string
}
//Resp From Initialize Endpoint
export interface ICardMakePaymentResp{
    transactionRef: string
    paymentId: string
    bankCode: string
    message: string
    amount: string
    responseCode:string //00, TO, SO,
    plainTextSupportMessage: string
}

//Resp from Authenticate Endpoint
export interface IAuthenticateOtpReq{
    paymentId:string,
    otp:string,
    transactionId:string,
}
export interface IAuthenticateOtpResp{
    transactionRef: string;
    bankCode: string;
    message: string
    transactionIdentifier: string
    amount: string
    responseCode: string; //'00',
    retrievalReferenceNumber:string
    stan: string
    terminalId: string
}

