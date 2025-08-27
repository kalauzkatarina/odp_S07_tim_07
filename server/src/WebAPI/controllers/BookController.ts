import { Request, Response, Router } from "express";
import { IBookService } from "../../Domain/services/books/IBookService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { BookDto } from "../../Domain/DTOs/books/BookDto";

export class BookController {
    private router: Router;
    private bookService: IBookService;

    constructor(bookService: IBookService) {
        this.router = Router();
        this.bookService = bookService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/books/topViewed", this.getTopViewed.bind(this));
        this.router.get("/books", this.getBooks.bind(this));
        this.router.get("/books/genre/:genre_id", this.getAllBooksByGenre.bind(this));
        this.router.get("/books/title/:title", this.getBookByTitle.bind(this));
        this.router.get("/books/author/:author", this.getBookByAuthor.bind(this));
        this.router.get("/books/:id", this.getBookById.bind(this));
        this.router.post("/books/add", authenticate, authorize("editor"), this.createBook.bind(this));
        this.router.put("/books/:id", authenticate, authorize("editor"), this.updateBook.bind(this));
        this.router.delete("/books/delete/:id", authenticate, authorize("editor"), this.deleteBook.bind(this));
        this.router.patch("/books/:id/views", this.incrementViews.bind(this));
    }

    private async getBooks(req: Request, res: Response) {
        try {
            const books = await this.bookService.getAllBooks();
            res.status(200).json(books);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async getAllBooksByGenre(req: Request, res: Response) {
        try {
            const { genre_id } = req.body;
            const books = await this.bookService.getAllBooksByGenre(genre_id);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async getBookByTitle(req: Request, res: Response) {
        try {
            const { title } = req.body;
            const book = await this.bookService.getBookByTitle(title);
            res.status(201).json(book);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async getBookByAuthor(req: Request, res: Response) {
        try {
            const { author } = req.body;
            const book = await this.bookService.getBookByAuthor(author);
            res.status(201).json(book);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async getBookById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const book = await this.bookService.getBookById(id);
            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async createBook(req: Request, res: Response) {
        try {
            const { title, author, summary, format, pages, script, binding, publish_date, isbn, cover_image_url, genres } = req.body;
            const createdBook = await this.bookService.createBook(title, author, summary, format, pages, script, binding, publish_date, isbn, cover_image_url, genres);
            res.status(200).json(createdBook);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async updateBook(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updates = req.body as Partial<BookDto>;
            const updatedBook = await this.bookService.updateBook(id, updates);
            res.status(200).json(updatedBook);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async deleteBook(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const result = await this.bookService.deleteBook(id);
            res.status(result ? 200 : 404).json({ success: result });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async incrementViews(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const book = await this.bookService.incrementViewsById(id); 
            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    private async getTopViewed(req: Request, res: Response) {
        try {
            const limit = Number(req.query.limit) || 3;
            const books = await this.bookService.getTopViewedBooks(limit);
            console.log(limit)
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}