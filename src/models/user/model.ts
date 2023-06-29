import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../exceptions/apiError";
import { User } from "./types";
import { ErrorMessages } from "../../exceptions/types";

export class UserModel {
    constructor(private users: User[]) {}

    getAll() {
        return this.users;
    }

    getById(id: string): User {
        const user = this.users.find((user) => user.id === id);

        if (!user) throw ApiError.notFound(ErrorMessages.USER_NOT_FOUND);
        
        return user;
    }

    create(user: User) {
        const newUser = { ...user, id: uuidv4() };
        this.users.push(newUser);
        return newUser;
    }
}