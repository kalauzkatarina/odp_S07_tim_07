import { Book } from "../../models/Book";

export class FavoriteBooksDto {
    public constructor(
        public id       : number = 0,
        public book_id  : number = 0,
        public user_id  : number = 0,
        public book     : Book
    ) { }
}