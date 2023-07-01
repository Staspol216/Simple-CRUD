import { IncomingMessage, ServerResponse } from "http";
import { IUserService } from "../services/types";
import { getPayload, getId } from "../helpers";
import { HTTPCodes } from "./types";

export class UserController {

    private userService;

    constructor(UserService: IUserService) {
        this.userService = UserService
    }

    async getAll(req: IncomingMessage, res: ServerResponse) {
        const users = await this.userService.getAll();
        this.sendResponse(res, users);
    }

    async getById(req: IncomingMessage, res: ServerResponse) {
        if (!req.url) return
        const id = getId(req.url);
        const user = await this.userService.getById(id);
        this.sendResponse(res, user);
    }

    async create(req: IncomingMessage, res: ServerResponse) {
        const payload = await getPayload(req);
        const newUser = await this.userService.create(payload);
        this.sendResponse(res, newUser, HTTPCodes.CREATED);
    }

    private sendResponse<T>(res: ServerResponse, data: T, status: HTTPCodes = HTTPCodes.OK) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = status;
        res.end(JSON.stringify(data));
    }
}