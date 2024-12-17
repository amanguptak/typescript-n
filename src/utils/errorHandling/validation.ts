import { HttpError ,ErrorCode} from "./root";

export class ValidationError extends HttpError{

    constructor(error:any , message:string ,errorCode:ErrorCode){
        const data={
            errors: error,
            message,
            statusCode:422,
            errorCode
        }
        super(data)
    }


}