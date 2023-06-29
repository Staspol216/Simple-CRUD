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

export const router = (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req;

    if (!url) return

    const [ api, users, id, ...rest ] = url.split('/').filter(Boolean);
    
    try {
        console.log(url, "url");
        console.log(url?.startsWith(USERS_API_URL));
        if (url?.startsWith(USERS_API_URL) && rest.length === 0) {
            switch (method) {
            case HTTPMethods.GET: 
                if (id) {
                    userController.getById(req, res)
                } else {
                    userController.getAll(req, res)
                }
                break;
            case HTTPMethods.POST:
                userController.create(req, res);
                break;
            }
        } else {
            throw ApiError.badRequest(ErrorMessages.INVALID_ENDPOINT);
        }
    } catch(e) {
        console.log(e);
    }
};