import {PaymentStatus} from "@prisma/client";

export interface ICreateInvoiceLogData {
    reference: string,
    req_payload: any,
    resp_payload: any,
    is_successful: boolean,
    action_type: string
}

export interface ICreateInvoiceData{
    reference :string,
    email: string,
    channel: string,
    amount: string,
    payment_status: PaymentStatus,
    gateway_reference?: string
}