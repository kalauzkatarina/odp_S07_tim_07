import bcrypt from "bcryptjs";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { UserRole } from "../../Domain/enums/UserRole";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/IUserRepository";
import { IUserService } from "../../Domain/services/users/IUserService";

export class UserService implements IUserService{
    private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
    
    public constructor(private userRepository: IUserRepository){}
        
    async getAllUsers(): Promise<UserDto[]> {
        const users: User[] = await this.userRepository.getAll();
        const usersDto: UserDto[] = users.map(
            (user) => new UserDto(user.id, user.username, user.email, user.role)
        );

        return usersDto;
    }

    async getUserById(id: number): Promise<UserDto> {
        const user = await this.userRepository.getById(id);
        console.log("Id:" + id)
        if(user.id !== 0){
            return new UserDto(user.id, user.username, user.email, user.role);
        }
        return new UserDto();
    }

    async updateUser(id: number, updates: { username?: string; email?: string; password?: string; role?: UserRole; }): Promise<UserDto> {
        console.log("ID: " + id)
        const existingUser = await this.userRepository.getById(id);
        console.log("Existing user: " + existingUser.id)
        
        if(existingUser.id == 0){
            return new UserDto();
        }

        if(updates.password){
            updates.password = await bcrypt.hash(updates.password, this.saltRounds);
        }
        
        const updatedUser = new User(
            existingUser.id,
            updates.username || existingUser.username,
            updates.password || existingUser.password,
            updates.email   || existingUser.email,
            updates.role || existingUser.role,
            existingUser.created_at
        );
        console.log("UpdatedUSer: " + updatedUser.username)
        const savedUser = await this.userRepository.update(updatedUser);
        console.log("SavedUSer" + savedUser.username)
        return new UserDto(savedUser.id, savedUser.username, savedUser.email, savedUser.role);
    }
}