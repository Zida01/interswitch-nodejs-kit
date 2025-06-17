


export class GeneralUtils{


    static generateReference = () => {
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const datePart = `${year}${month}${day}${seconds}`;

        const randomPart = Math.random().toString(36).substring(2, 14).toUpperCase(); // 12 chars
         // ensures exact 20 chars
        return `${datePart}${randomPart}`.substring(0, 20);
    }
}