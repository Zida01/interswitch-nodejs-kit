import prisma from "../../_lib/db/prisma";
import {LoggerUtils} from "../../_lib/logger.utils";
import {ICreateInvoiceLogData} from "../invoice.type";



export class InvoiceLogRepository {

    createInvoiceLog = async (invLogData:ICreateInvoiceLogData) => {
        try{
            await prisma.invoiceLog.create({
                data: {
                    reference:invLogData.reference,
                    req_payload: JSON.stringify(invLogData.req_payload),
                    resp_payload: JSON.stringify(invLogData.resp_payload),
                    is_successful:invLogData.is_successful,
                    action_type:invLogData.action_type,
                }
            })
            return true;
        }
        catch (e:any) {
            LoggerUtils.error(e)
            return false
        }
    }

}