export class FavoriteBooks {
    public constructor(
        public id       : number = 0,
        public book_id  : number = 0,
        public user_id  : number = 0,
        public favorite : boolean = false
    ) { }
}