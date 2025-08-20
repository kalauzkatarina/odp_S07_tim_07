import { AuthorDto } from "../authors/AuthorDto";
import { GenreDto } from "../genres/GenreDto";

export class BookDto {
    public constructor(
        public id               : number = 0,
        public title            : string = '',
        public summary          : string = '',
        public format           : string = '',
        public pages            : number = 0,
        public script           : string = '',
        public binding          : string = '',
        public publish_date     : string = '',
        public isbn             : string = '',
        public cover_image_url  : string = '',
        public views            : number = 0,
        public authors          : AuthorDto[] = [],
        public genres           : GenreDto[] = []
    ) { }
}