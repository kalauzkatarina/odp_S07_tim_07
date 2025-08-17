export class Comment {
    public constructor(
        public id               : number = 0,
        public content          : string = '',
        public created_at       : Date = new Date(),
        public user_id          : number = 0,
        public book_id          : number = 0
    ){}
}