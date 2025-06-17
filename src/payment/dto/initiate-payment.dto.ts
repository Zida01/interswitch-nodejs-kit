export interface InitiatePaymentDto {
    channel: 'card' | 'bank-transfer'
    amount : string
    email: string
    pan: string,
    pin: string,
    cvv2: string,
    expireMonth:string,
    expireYear: string
}