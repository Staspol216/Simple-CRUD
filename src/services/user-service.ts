import { ErrorMessages } from "../exceptions/types";
import { ApiError } from "../exceptions/apiError";
import { validate } from "uuid";
import { User } from "../models/user/types";
import { isValidUser } from "../helpers";
import userModel from "../models/user/model";

class UserService {
    async getAll() {
        return userModel.getAll();
    }

    async getById(id: string) {
        if (!validate(id)) throw ApiError.badRequest(ErrorMessages.INVALID_ID);
        const user = userModel.getById(id);
        if (!user) throw ApiError.notFound(ErrorMessages.USER_NOT_FOUND)
        return await userModel.getById(id);
    }

    async create(payload: User) {
        if (!isValidUser(payload)) throw ApiError.badRequest(ErrorMessages.INVALID_USER_DATA);
        const newUser = await userModel.create(payload);
        return newUser
    }

    async update(id: string, payload: User) {
        console.log(validate(id));
        if (!validate(id)) throw ApiError.badRequest(ErrorMessages.INVALID_ID);
        if (!isValidUser(payload)) throw ApiError.badRequest(ErrorMessages.INVALID_USER_DATA);
        const updatedUser = await userModel.update(id, payload);
        return updatedUser;
    }

    async delete(id: string) {
        if (!validate(id)) throw ApiError.badRequest(ErrorMessages.INVALID_ID);
        await userModel.delete(id);
    }
}

export default new UserService();