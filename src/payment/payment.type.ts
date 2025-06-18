


export interface IPaymentInitializeData {
    email:string
    amount:string
    reference:string
    pan:string
    pin:string
    cvv2:string
    expireMonth:string
    expireYear:string
}


//expected Response From Different Payment Service
export interface IPaymentInitializeServiceResp<Req,Resp>{
    reqBody: Req,
    respData:Resp
    message:string;
    next_action : string
    reference:string
    gateway_reference:string
}


//expected Response to Payment Controller
export interface IPaymentInitializeResp{
    message:string;
    next_action : string
    reference:string
}