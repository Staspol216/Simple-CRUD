import { IncomingMessage, ServerResponse } from "http";
import { ErrorMessages } from "../exceptions/types";
import { ApiError } from "../exceptions/apiError";
import { USERS_API_URL } from "./const";
import { HTTPMethods } from "./types";
import userController from "../controllers/user-controller";
import { HTTPStatusMessages } from "../controllers/types";

export const router = async (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req;
    
    try {
        if (!url) throw ApiError.badRequest(ErrorMessages.INVALID_ENDPOINT);

        const [ _, __, id, ...rest ] = url.split('/').filter(Boolean);

        if (!url?.startsWith(USERS_API_URL) || rest.length !== 0) throw ApiError.notFound(ErrorMessages.INVALID_ENDPOINT);

        switch (method) {
        case HTTPMethods.GET: 
            if (id) {
                await userController.getById(req, res)
            } else {
                await userController.getAll(req, res)
            }
            break;
        case HTTPMethods.POST:
            if (id) throw ApiError.badRequest(ErrorMessages.INVALID_ENDPOINT);
            await userController.create(req, res);
            break;
        case HTTPMethods.PUT:
            await userController.update(req, res);
            break;
        case HTTPMethods.DELETE:
            await userController.delete(req, res);
            break;
        default:
            throw ApiError.badRequest(ErrorMessages.UNAVAILABLE_METHOD);
        }

    } catch(error) {
        const { message, status } = error instanceof ApiError ? error : ApiError.internalServerError();
        res.writeHead(status, HTTPStatusMessages.ERROR, {"Content-Type": "application/json"})
        res.end(JSON.stringify({ message }));
    }
};