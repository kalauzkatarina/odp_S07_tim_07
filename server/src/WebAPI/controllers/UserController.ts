import { Response, Request, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UserController {
    private router: Router;
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.router = Router();
        this.userService = userService;
        this.initializeRoutes();
    }

     private initializeRoutes(): void {
        this.router.get("/users", authenticate, authorize("editor"), this.users.bind(this));
    }


    private async users(req: Request, res: Response): Promise<void> {
        try {
        const usersDatas: UserDto[] =
            await this.userService.getAllUsers();

        res.status(200).json(usersDatas);
        return;
        } catch (error) {
        res.status(500).json({ success: false, message: error });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}