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

    //getUserById služi da dohvatiš podatke o korisniku (npr. kod komentara da se prikaže ime).
    async getUserById(id: number): Promise<UserDto> {
        const user = await this.userRepository.getById(id);
        
        if(user.id !== 0){
            return new UserDto(user.id, user.username, user.email, user.role);
        }
        return new UserDto(); //nije nasao user
    }

    //updateUser daje korisniku mogućnost da menja podatke (ili admin da menja role).
    async updateUser(id: number, updates: { username?: string; email?: string; password?: string; role?: UserRole; }): Promise<UserDto> {
        const existingUser = await this.userRepository.getById(id);
        
        if(existingUser.id == 0){
            return new UserDto();
        }

        //ako se menja lozinka, hash-uje se
        if(updates.password){
            updates.password = await bcrypt.hash(updates.password, this.saltRounds);
        }
        
        const updatedUser = new User(
            existingUser.id,
            updates.username || existingUser.username,
            updates.password || existingUser.password,
            updates.email   || existingUser.email,
            updates.role || existingUser.role
        );

        const savedUser = await this.userRepository.update(updatedUser);

        return new UserDto(savedUser.id, savedUser.username, savedUser.email, savedUser.role);
    }
}