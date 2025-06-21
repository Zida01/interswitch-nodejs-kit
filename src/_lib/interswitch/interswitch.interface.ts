export interface ICardMakePaymentResp{
    transactionRef: string
    paymentId: string
    bankCode: string
    message: string
    amount: string
    responseCode:string //00, TO, SO,
    plainTextSupportMessage: string
}

export interface InitializeCardPaymentReq{
    customerId: string
    amount: string
    currency: string
    authData:string
    transactionRef: string
}
export interface nameEnquiryReq{
    accountNumber: number
    bankCode:number
}