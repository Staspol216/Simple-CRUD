
export const enum ErrorCodes {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}
  
export enum ErrorMessages {
    INTERNAL_SERVER_ERROR = "Unexpected server error",
    INVALID_ENDPOINT = "Endpoint is not exist",
    INVALID_ID = "Target id is not valid",
    INVALID_USER_DATA = "Invalid user payload data",
    USER_NOT_FOUND = "User with target id not found"
}