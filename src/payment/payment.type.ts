
//expected Response to Payment Controller
import {PaymentStatus} from "@prisma/client";

export interface IPaymentInitializeResp{
    message:string;
    next_action : string
    reference:string
}

//
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


//expected Response From Different Payment Service for Initialize Req
export interface IPaymentInitializeServiceResp<Req,Resp>{
    reqBody: Req,
    respData:Resp
    message:string;
    next_action : 'confirm_status' | 'otp' | 'redirect' | 'unknown'
    reference:string
    gateway_reference:string
}


//expected Response From Different PaymentAuthenticateOtp Service
export interface IPaymentServiceResp<Req,Resp>{
    reqBody: Req,
    respData:Resp
    message:string;
    next_action : string
    reference:string
    gateway_reference:string
    payment_status?: PaymentStatus
    payment_date ?: string | null
}

export interface IPaymentVerifyResp{
    payment_status:PaymentStatus;
    // next_action: string
    reference:string
    paid_at:string | null
}
