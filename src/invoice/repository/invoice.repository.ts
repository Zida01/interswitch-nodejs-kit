import {LoggerUtils} from "../../_lib/logger.utils";
import prisma from "../../_lib/db/prisma";
import {ICreateInvoiceData} from "../invoice.type";
import {Prisma} from "@prisma/client";


export class InvoiceRepository{

    getInvoiceByReference = async (reference:string) => {
        try{
            return await prisma.invoice.findFirst({ where: { reference } });
        }
        catch (e) {
            LoggerUtils.error(e)
            return null;
        }
    }
    /**
     *
     * @param invoiceData
     */
    createInvoice = async (invoiceData:ICreateInvoiceData) => {
        try{
            await prisma.invoice.create({
                data: {
                    reference:invoiceData.reference,
                    email: invoiceData.email,
                    channel: invoiceData.channel,
                    amount: invoiceData.amount,
                    payment_status: invoiceData.payment_status,
                    gateway_reference: invoiceData.gateway_reference
                }
            })
        }
        catch (e) {
            LoggerUtils.error(e)
            return null;
        }
    }


    /**
     *
     * @param reference
     * @param updateData
     */
    updateInvoice = async (reference:string,updateData:Prisma.InvoiceUpdateInput) => {
        try{
            await prisma.invoice.update({
                where:{reference},
                data :updateData
            })
            return true
        }
        catch (e) {
            LoggerUtils.error(e)
            return false
        }
    }
}