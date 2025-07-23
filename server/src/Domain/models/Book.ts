import { Genres } from "../enums/Genres";

export class Book {
    public constructor(
        public id               : number = 0,
        public title            : string = '',
        public author           : string = '',
        public genres           : Genres = Genres.None,
        public summary          : string = '',
        public format           : string = '',
        public pages            : number = 0,
        public script           : string = '',
        public binding          : string = '',
        public publish_date     : string = '',
        public isbn             : string = '',
        public cover_image_url  : string = ''
    ){}
}