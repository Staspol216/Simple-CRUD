import { IncomingMessage, ServerResponse } from "http";
import { ErrorMessages } from "../exceptions/types";
import { UserController } from "../controllers/user-controller";
import { ApiError } from "../exceptions/apiError";
import { USERS_API_URL } from "./const";
import { HTTPMethods } from "./types";
import { UserService } from "../services/user-service";
import { UserModel } from "../models/user/model";

const userRepository = new UserModel([]);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export const router = async (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req;
    
    try {
        if (!url) throw ApiError.badRequest(ErrorMessages.INVALID_ENDPOINT);

        const [ _, __, id, ...rest ] = url.split('/').filter(Boolean);

        if (!url?.startsWith(USERS_API_URL) || rest.length !== 0) throw ApiError.badRequest(ErrorMessages.INVALID_ENDPOINT);

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
        }

    } catch(error) {
        const { message, status } = error instanceof ApiError ? error : ApiError.internalServerError();
        res.statusCode = status;
        res.end(JSON.stringify({ message }));
    }
};