import { Genre } from "../models/Genre";

export interface IGenreRepository {
    create(genre: Genre): Promise<Genre>;
    getById(id: number): Promise<Genre>;
    getByName(name: string): Promise<Genre>;
    getAll(filters?: { id?: number; name?: string; }): Promise<Genre[]>;
    update(genre: Genre): Promise<Genre>;
    delete(id: number): Promise<boolean>;
    exists(id: number): Promise<boolean>;
}