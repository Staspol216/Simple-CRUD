export interface IUserModel {
    [ACTIONS.GET_ALL]: () => User[];
    [ACTIONS.GET_BY_ID]: (id: string) => User;
    [ACTIONS.CREATE]: (user: User) => User;
    [ACTIONS.UPDATE]: (id: string, payload: User) => User;
    [ACTIONS.DELETE]: (id: string) => void;
}

export enum ACTIONS {
    GET_ALL = "getAll",
    GET_BY_ID = "getById",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}

export interface WorkerMessage {
    action: ACTIONS
    payload?: any[]
}

export interface User {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
}