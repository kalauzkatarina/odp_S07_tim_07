import { Request, Response, Router } from "express";
import { IBookService } from "../../Domain/services/books/IBookService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class BookController {
    private router: Router;
    private bookService: IBookService;

    constructor(bookService: IBookService){
        this.router = Router();
        this.bookService = bookService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void{
        this.router.get("/books", this.getBooks.bind(this));
        this.router.get("/books/:title", this.getBookByTitle.bind(this));
        this.router.post("/books", authenticate, authorize("editor"), this.createBook.bind(this));
        this.router.put("/books/title:", authenticate, authorize("editor"), this.updateBook.bind(this));
        this.router.delete("/books/id:", authenticate, authorize("editor"), this.deleteBook.bind(this));
        this.router.patch("/books/:id/views", this.incrementViews.bind(this));
    }

    private async getBooks(req: Request, res: Response){
        try{
            const filters = {
                title: req.query.title as string,
                author: req.query.author as string,
                genre: req.query.genre as string
            };
            const books = await this.bookService.getAllBooks(filters);
            res.status(200).json(books);
        }
        catch (error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async getBookByTitle(req: Request, res: Response){
        try{
            const book = await this.bookService.createBook(req.body);
            res.status(201).json(book);
        }
        catch (error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async createBook(req: Request, res: Response){
        try{
            const updatedBook = await this.bookService.updateBook(req.params.title, req.body);
            res.status(200).json(updatedBook);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async updateBook(req: Request, res: Response){
        try{
            const updatedBook = await this.bookService.updateBook(req.params.title, req.body);
            res.status(200).json(updatedBook);
        }
        catch (error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async deleteBook(req: Request, res: Response){
        try{
            const result = await this.bookService.deleteBook(Number(req.params.id));
            res.status(result ? 200: 404).json({success: result});
        }
        catch (error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async incrementViews(req: Request, res: Response){
        try{
            const book = await this.bookService.incrementViews(req.params.title);
            res.status(200).json(book);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    public gerRouter(): Router{
        return this.router;
    }
}