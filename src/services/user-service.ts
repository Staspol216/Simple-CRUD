import { ErrorMessages } from "../exceptions/types";
import { ApiError } from "../exceptions/apiError";
import { validate } from "uuid";
import { IUserModel } from "../models/user/types";
import { User } from "../models/user/types";
import { isValidUser } from "../helpers/isValidUser";

export class UserService {
    constructor(UserModel: IUserModel) {
        this.userModel = UserModel;
    }

    async getAll() {
        return this.userModel.getAll();
    }

    async getById(id: string) {
        if (!validate(id)) throw ApiError.badRequest(ErrorMessages.INVALID_ID);
        return this.userModel.getById(id);
    }

    async create(payload: User) {
        if (!isValidUser(payload)) throw ApiError.badRequest(ErrorMessages.INVALID_USER_DATA);
        const newUser = this.userModel.create(payload);
        return newUser
    }

    private userModel;
}