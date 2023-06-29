import { User } from "../models/user/types";

export const isValidUser = (user: User) => {
    return (
        typeof user.username === "string" &&
        typeof user.age === "number" &&
        Array.isArray(user.hobbies) &&
        user.hobbies.every((hobbie) => typeof hobbie === "string")
    );
};