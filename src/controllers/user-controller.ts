import { IncomingMessage, ServerResponse } from "http";
import { getPayload, getId } from "../helpers";
import { HTTPStatusCodes, HTTPStatusMessages } from "./types";
import userService from "../services/user-service";

export class UserController {
    async getAll(req: IncomingMessage, res: ServerResponse) {
        const users = await userService.getAll();
        this.sendResponse(res, users);
    }

    async getById(req: IncomingMessage, res: ServerResponse) {
        if (!req.url) return
        const id = getId(req.url);
        const user = await userService.getById(id);
        this.sendResponse(res, user);
    }

    async create(req: IncomingMessage, res: ServerResponse) {
        const payload = await getPayload(req);
        const newUser = await userService.create(payload);
        this.sendResponse(res, newUser, HTTPStatusCodes.CREATED);
    }

    async update(req: IncomingMessage, res: ServerResponse) {
        if (!req.url) return
        const id = getId(req.url);
        const payload = await getPayload(req);
        const updatedUser = await userService.update(id, payload);
        this.sendResponse(res, updatedUser);
    }

    async delete(req: IncomingMessage, res: ServerResponse) {
        if (!req.url) return
        const id = getId(req.url);
        await userService.delete(id);
        this.sendResponse(res, {}, HTTPStatusCodes.DELETED);
    }

    private sendResponse<T>(
        res: ServerResponse, 
        data: T, 
        status: HTTPStatusCodes = HTTPStatusCodes.OK, 
        statusMessage = HTTPStatusMessages.OK
    ) {
        res.writeHead(status, statusMessage, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(data));
    }
}

export default new UserController();