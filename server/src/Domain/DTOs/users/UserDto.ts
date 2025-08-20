import { UserRole } from "../../enums/UserRole";

export class UserDto {
    public constructor(
        public id: number = 0,
        public username: string = '',
        public email: string = '',
        public role: UserRole = UserRole.None
    ) { }
}