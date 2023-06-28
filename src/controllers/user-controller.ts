import { IncomingMessage, ServerResponse } from "http";

const enum HTTPCodes {
    OK = 200,
}

export class UserController {
    async getOne(req: IncomingMessage, res: ServerResponse) {
        try {
            this.sendResponse(res, { test: 1});
        } catch(e) {
            console.log(e);
        }
    }

    async getAll(req: IncomingMessage, res: ServerResponse) {
        try {
            console.log("getAll");
        } catch(e) {
            console.log(e);
        }
    }

    private sendResponse<T>(res: ServerResponse, data: T,status: HTTPCodes = HTTPCodes.OK) {
        res.statusCode = status;
        res.end(JSON.stringify(data));
    }
}