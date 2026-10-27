export class GlobalResponseObject<T = any> {
    status: boolean;
    errorCode: number;
    internalMessage: string;
    data?: T;
    /**
     *
     * @param status
     * @param errorCode
     * @param internalMessage
     * @param data
     */
    constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Success', data?: T){
        this.status = status;
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
        this.data = data;
    }
}

export const GlobalResponseDto = GlobalResponseObject;

export class ErrorResponse extends Error {
    errorCode: number;
    constructor(errorCode: number, message: string) {
        super(message);
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}
