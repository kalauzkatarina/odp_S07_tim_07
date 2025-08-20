import { Request, Response, Router } from "express";
import { IGenreService } from "../../Domain/services/genres/IGenreService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class GenreController{
    private router: Router;
    private genreService: IGenreService;

    constructor(genreService: IGenreService){
        this.router = Router();
        this.genreService = genreService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/genres", this.getGenres.bind(this));
        this.router.post("/genres", authenticate, authorize("editor"), this.createGenre.bind(this));
    }

    private async getGenres(req: Request, res: Response){
        try{
            const filters: {id?: number, name?: string} = {}
            if(req.query.id) filters.id = Number(req.query.id);
            if(req.query.name) filters.name = String(req.query.name);
            const genres = await this.genreService.getAllGenres(filters);
            res.status(201).json(genres);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async createGenre(req: Request, res: Response){
        try{
            const genre = await this.genreService.createGenre(req.body);
            res.status(200).json(genre);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    public getRouter(): Router{
        return this.router;
    }
}