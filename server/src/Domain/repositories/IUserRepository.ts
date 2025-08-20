import { User } from "../models/User";

export interface IUserRepository {
    create(user: User): Promise<User>;
    getById(id: number): Promise<User>;
    getByUsername(username: string): Promise<User>;
    getByEmail(email: string): Promise<User>;
    getByRole(role: string): Promise<User>;
    getAll(): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}