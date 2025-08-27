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
        this.router.get("/genres/get", this.getGenres.bind(this));
        this.router.post("/genres", authenticate, authorize("editor"), this.createGenre.bind(this));
        this.router.delete("/genres", authenticate, authorize("editor"), this.deleteGenre.bind(this));
    }

    private async getGenres(req: Request, res: Response){
        try{
            const genres = await this.genreService.getAllGenres();
            res.status(200).json(genres);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    private async createGenre(req: Request, res: Response){
        try{
            const { name } = req.body;
            const genre = await this.genreService.createGenre(name);
            console.log(genre);
            res.status(201).json(genre);
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

     private async deleteGenre(req: Request, res: Response){
        try{
            const { id } = req.body;
            const result = await this.genreService.deleteGenre(id);
            res.status(result ? 200 : 404).json({success: result});
        }
        catch(error){
            res.status(500).json({success: false, message: error});
        }
    }

    public getRouter(): Router{
        return this.router;
    }
}