import { UserRole } from "../enums/UserRole";

export class User{
    public constructor(
        public id               : number = 0,
        public username         : string = '',
        public password         : string = '',
        public email            : string = '',
        public role             : UserRole = UserRole.None,
        public created_at       : Date = new Date()
    ){}
}