import type { GenreDto } from "../genres/GenreDto";

export interface BookDto{
    id               : number;
    title            : string;
    author           : string;
    summary          : string;
    format           : string;
    pages            : number;
    script           : string;
    binding          : string;
    publish_date     : string;
    isbn             : string;
    cover_image_url  : string;
    views            : number;
    genres           : GenreDto[];
}