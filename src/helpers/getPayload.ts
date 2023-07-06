import { IncomingMessage } from "http";
import { ApiError } from "../exceptions/apiError";

export const getPayload = async (req: IncomingMessage)=> {
    const buff: Uint8Array[] = [];

    try {
        for await (const chunk of req) {
            buff.push(chunk);
        }
    } catch(e) {
        throw ApiError.internalServerError()
    }

    const payload = Buffer.concat(buff).toString();
    return JSON.parse(payload)
};