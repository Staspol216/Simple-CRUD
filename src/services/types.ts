import { User } from "../models/user/types";

export interface IUserService {
    getAll: () => Promise<User[]>;
    getById: (id: string) => Promise<User>;
    create: (payload: User) => Promise<User>;
    update: (id: string, payload: User) => Promise<User>;
    delete: (id: string) => void;
}