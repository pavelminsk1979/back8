export enum ResultCode {
    Success = 'Success',
    Failure = 'Failure',
    NotFound = 'NotFound'  //404
}

export type ObjectResult<T = null> = {
    code: ResultCode
    errorMessage?: string
    data: T
}