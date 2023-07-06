import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../../exceptions/apiError";
import { ACTIONS, User } from "./types";
import { ErrorMessages } from "../../exceptions/types";
import { users } from "../../data/db";
import cluster from "cluster";

class UserModel {
    
    public async getAll() {
        if (cluster.isPrimary) {
            return users;
        } else {
            return await this.workerRequest({ action: ACTIONS.GET_ALL });
        }
    }

    public async getById(id: string) {
        if (cluster.isPrimary) {
            const user = users.find((user) => user.id === id);
            if (!user) throw ApiError.notFound(ErrorMessages.USER_NOT_FOUND);
            return user;
        } else {
            return await this.workerRequest({ action: ACTIONS.GET_BY_ID, payload: [id] })
        }
    }

    public async create(user: User) {
        if (cluster.isPrimary) {
            const newUser = { ...user, id: uuidv4() };
            users.push(newUser);
            return newUser;
        } else {
            return await this.workerRequest({ action: ACTIONS.CREATE, payload: [user] })
        }
    }

    public async update(id: string, payload: User) {
        if (cluster.isPrimary) {
            const userIndex = users.findIndex((user) => user.id === id);
            if (userIndex == -1) throw ApiError.notFound(ErrorMessages.USER_NOT_FOUND);
            const updatedUser = {...users[userIndex], ...payload};
            users[userIndex] = updatedUser;
            return updatedUser
        } else {
            return await this.workerRequest({ action: ACTIONS.UPDATE, payload: [id, payload] });
        }
    }

    public async delete(id: string) {
        if (cluster.isPrimary) {
            const userIndex = users.findIndex((user) => user.id === id);
            if (userIndex == -1) throw ApiError.notFound(ErrorMessages.USER_NOT_FOUND);
            users.splice(userIndex, 1);
            return {}
        } else {
            return await this.workerRequest({ action: ACTIONS.DELETE, payload: [id] });
        }
        
    }

    private workerRequest(message) {
        return new Promise((resolve, reject) => {
            if (!process.send) return
            process.send(message);
            process.once("message", (response: any) => {
                if (response.data) {
                    resolve(response.data)
                } else {
                    reject(new ApiError(response.status, response.message));
                }
            });
        });
    }
}

export default new UserModel();