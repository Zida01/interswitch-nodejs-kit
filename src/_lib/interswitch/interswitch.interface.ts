export interface ICardMakePaymentResp{
    transactionRef: string
    paymentId: string
    bankCode: string
    message: string
    amount: string
    responseCode:string //TO
    plainTextSupportMessage: string
}
