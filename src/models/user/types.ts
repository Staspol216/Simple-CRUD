export interface IUserModel {
    getAll: () => User[];
    getById: (id: string) => User;
    create: (user: User) => User;
}

export interface User {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
}