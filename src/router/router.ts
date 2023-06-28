import { IncomingMessage, ServerResponse } from "http";
import { ErrorMessages } from "../apiError/types";
import { UserController } from "../controllers/user-controller";
import { ApiError } from "../apiError/apiError";
import { USERS_API_URL } from "./const";
import { HTTPMethods } from "./types";

const userController = new UserController();

export const router = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    const { url, method } = req;
    
    try {
        console.log(url, "url");
        console.log(url?.startsWith(USERS_API_URL))
        if (url?.startsWith(USERS_API_URL)) {
            const [ api, users, id, ...rest ] = url.split('/');
            switch (method) {
            case HTTPMethods.GET: 
                if (id) {
                    userController.getOne(req, res)
                } else {
                    userController.getAll(req, res)
                }
            }
        } else {
            throw ApiError.badRequest(ErrorMessages.INVALID_ENDPOINT);
        }

    } catch(e) {
        console.log(e);
    }
};