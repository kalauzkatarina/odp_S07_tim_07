import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Book } from "../../Domain/models/Book";
import { IBookRepository } from "../../Domain/repositories/IBooksRepository";
<<<<<<< Updated upstream
import db from "../connection/db_connection_pool";
import { Genres } from "../../Domain/enums/Genres";
=======
import db from "../connection/DbConnectionPool";
>>>>>>> Stashed changes

export class BookRepository implements IBookRepository{
    async create(book: Book): Promise<Book> {
        try{
            const query = `INSERT INTO books (title, author, genres, summary, format, pages, script, binding, publish_date, isbn, cover_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const [result] = await db.execute<ResultSetHeader>(query, [
                book.title,
                book.author,
                book.genres,
                book.summary,
                book.format,
                book.pages,
                book.script,
                book.binding,
                book.publish_date,
                book.isbn,
                book.cover_image_url
            ]);

            if (result.insertId){
                return new Book(result.insertId, book.title, book.author, book.genres, book.summary, book.format, book.pages, book.script, book.binding, book.publish_date, book.isbn, book.cover_image_url);
            }
            return new Book();
        }
<<<<<<< Updated upstream
        catch(error){
            console.error("Error creating user: ", error);
=======
        catch (error) {
            console.error("Error creating book: ", error);
>>>>>>> Stashed changes
            return new Book();
        }
    }
    async getByTitle(title: string): Promise<Book> {
        try{
            const query = `SELECT * FROM books WHERE title = ?`;

            const[rows] = await db.execute<RowDataPacket[]>(query, [title]);
            if(rows.length > 0){
                const row = rows[0];
                return new Book(row.id, row.title, row.author, row.genres, row.summary, row.format, row.pages, row.script, row.binding, row.publlish_date, row.isbn, row.cover_image_url);
            }
            return new Book();
        }
        catch(error){
            console.error("Error getting the book by title: ", error);
            return new Book();
        }
    }
    async getByAuthor(author: string): Promise<Book> {
        try{
            const query = `SELECT * FROM books WHERE author = ?`;

            const[rows] = await db.execute<RowDataPacket[]>(query, [author]);
            if(rows.length > 0){
                const row = rows[0];
                return new Book(row.id, row.title, row.author, row.genres, row.summary, row.format, row.pages, row.script, row.binding, row.publlish_date, row.isbn, row.cover_image_url);
            }
            return new Book();
        }
        catch(error){
            console.error("Error getting the book by author: ", error);
            return new Book();
        }
    }
    async getByGenre(genre: Genres): Promise<Book> {
        try{
            const query = `SELECT * FROM books WHERE genre = ?`;

            const[rows] = await db.execute<RowDataPacket[]>(query, [genre]);
            if(rows.length > 0){
                const row = rows[0];
                return new Book(row.id, row.title, row.author, row.genres, row.summary, row.format, row.pages, row.script, row.binding, row.publlish_date, row.isbn, row.cover_image_url);
            }
            return new Book();
        }
        catch(error){
            console.error("Error getting the book by genre: ", error);
            return new Book();
        }
    }
    async getAll(): Promise<Book[]> {
        try{
            const query = `SELECT * FROM books ORDER BY id ASC`;
            
            const[rows] = await db.execute<RowDataPacket[]>(query);

            return rows.map(
                (row) => new Book(row.id, row.title, row.author, row.genres, row.summary, row.format, row.pages, row.script, row.binding, row.publlish_date, row.isbn, row.cover_image_url)
            )
        }
        catch(error){
            console.error("Error getting all books: ", error);
            return [];
        }
    }
    async update(book: Book): Promise<Book> {
        try{
            const query = `UPDATE books SET title = ?, author = ?, genres = ?, summary = ?, format = ?, pages = ?, script = ?, script = ?, binding = ?, publish_date = ?, isbn = ?, cover_image_url = ? WHERE id = ?`
            
            const[result] = await db.execute<ResultSetHeader>(query, [
                book.title,
                book.author,
                book.genres,
                book.summary,
                book.format,
                book.pages,
                book.script,
                book.binding,
                book.publish_date,
                book.isbn,
                book.cover_image_url
            ]);

            if (result.affectedRows > 0){
                return book;
            }

            return new Book();
        }
        catch(error){
            console.error("Error updating the book: ", error);
            return new Book();
        }
    }
    async delete(id: number): Promise<boolean> {
        try{
            const query = `DELETE FROM books WHERE id = ?`;

            const[result] = await db.execute<ResultSetHeader>(query, [id]);

            return result.affectedRows > 0;
        }
        catch(error){
            console.error("Error deleting a book from the database: ", error);
            return false;
        }
    }
    async exists(id: number): Promise<boolean> {
        try{
            const query = `SELECT COUNT(*) as count FROM books WHERE id = ?`;

            const[rows] = await db.execute<RowDataPacket[]>(query, [id]);

            return rows[0].count > 0;
        }
        catch(error){
            console.error("Error finding the book by id: ", error);
            return false;
        }
    }
    
}