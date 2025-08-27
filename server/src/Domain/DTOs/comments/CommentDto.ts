export class CommentDto {
    public constructor(
        public id           : number = 0,
        public content      : string = '',
        public user_id      : number = 0,
        public book_id      : number = 0,
        public username     : string = ''
    ) { }
}