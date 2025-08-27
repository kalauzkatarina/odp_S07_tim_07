import { UserAuthDataDto } from "../../Domain/DTOs/auth/UserAuthDataDto";
import { UserRole } from "../../Domain/enums/UserRole";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/IUserRepository";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import bcrypt from "bcryptjs";

export class AuthService implements IAuthService {
    private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
    
    public constructor(private userRepository: IUserRepository){}
    
    async getMe(id: number): Promise<UserAuthDataDto> {
        const user = await this.userRepository.getById(id);

        if(user.id !== 0){
            return new UserAuthDataDto(user.id, user.username, user.email, user.role);
        }

        return new UserAuthDataDto();
    }

    async logIn(username: string, password: string): Promise<UserAuthDataDto> {
        const user = await this.userRepository.getByUsername(username);

        if(user.id !== 0 && await bcrypt.compare(password, user.password)){
            return new UserAuthDataDto(user.id, user.username, user.email, user.role);
        }

        return new UserAuthDataDto();
    }

    async signUp(username: string, password: string, email: string, role: UserRole): Promise<UserAuthDataDto> {
        const existingUser = await this.userRepository.getByUsername(username);
        if(existingUser.id !== 0){
            return new UserAuthDataDto(); 
        }

        const hashedPassword = await bcrypt.hash(password, this.saltRounds);

        const newUser = await this.userRepository.create(
            new User(0, username, hashedPassword, email, role)
        );

        if(newUser.id !== 0){
            return new UserAuthDataDto(newUser.id, newUser.username, newUser.email, newUser.role);
        }

        return new UserAuthDataDto();  
    } 
}