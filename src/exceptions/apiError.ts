import { HTTPStatusCodes } from "src/controllers/types";
import {  ErrorMessages } from "./types";

export class ApiError extends Error {
    constructor(public status: number, message: string, public errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(message: string, errors = []) {
        return new ApiError(HTTPStatusCodes.BAD_REQUEST, message, errors)
    }

    static notFound(message: string) {
        return new ApiError(HTTPStatusCodes.NOT_FOUND, message);
    }

    static internalServerError() {
        return new ApiError(HTTPStatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
    }

}