export interface InitiatePaymentDto {
    channel: 'card' | 'bank-transfer'
    amount : number
}