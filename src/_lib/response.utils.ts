
export interface IResponse<T> {
    status: boolean;
    message: string;
    data: T
}


export class ResponseUtils {

    static handleResponse<T>(status: boolean, message: string, data: T): IResponse<T> {
        return {
            status,
            message,
            data
        };
    }

}