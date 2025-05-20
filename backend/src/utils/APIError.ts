class APIError extends Error {
    statuscode: any;
    data: null;
    success: boolean;
    error: never[];
    constructor (
        statuscode: any,
        message = "Something went wrong",
        error = [],
        stack = ""
    ){
        super(message)
        this.statuscode = statuscode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this , this.constructor);
        }
    }
}
export {APIError};