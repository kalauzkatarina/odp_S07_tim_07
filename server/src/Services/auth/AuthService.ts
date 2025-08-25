import { UserAuthDataDto } from "../../Domain/DTOs/auth/UserAuthDataDto";
import { UserRole } from "../../Domain/enums/UserRole";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/IUserRepository";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import bcrypt from "bcryptjs";

export class AuthService implements IAuthService {
    private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
    
    public constructor(private userRepository: IUserRepository){}
    
    //ova metoda da vraca podatke o trenutnom korisniku
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
        //console.log("Existing user:" + existingUser)
        if(existingUser.id !== 0){
            return new UserAuthDataDto(); //korisnik vec postoji
        }

        //hash-ujemo lozinku pre cuvanja
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);

        const newUser = await this.userRepository.create(
            new User(0, username, hashedPassword, email, role)
            //Ja sam mislila da treba da se salje u konstruktor to kao new Date za taj created_at, ali pitala gpt i ovo je stvarno logicno, da to ima default vrednost u bazi, pa ce to staviti uvek kad se doda u bazu novi korisnik 
            //Ako u bazi imaš created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, onda ne moraš da šalješ created_at iz aplikacije.
            //👉 Baza će sama popuniti taj podatak trenutnim datumom i vremenom kada se insert izvrši.
            //Ako ipak u aplikaciji šalješ new Date(), onda rizikuješ da ti vreme zavisi od servera
            //(ili čak klijenta ako se prosleđuje dalje). To može da se razlikuje od vremena u bazi i da unese konfuziju.
        );

        if(newUser.id !== 0){
            return new UserAuthDataDto(newUser.id, newUser.username, newUser.email, newUser.role);
        }

        return new UserAuthDataDto();  //registracija nije uspela
    } 
}