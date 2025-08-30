import { Response, Request, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export type JwtPayloadUser = {
    id: number;
    username: string;
    role: string;
};

declare module "express" {
    interface Request {
        user?: JwtPayloadUser;
    }
}

export class UserController {
    private router: Router;
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.router = Router();
        this.userService = userService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.put("/users/update/:id", authenticate, this.updateUser.bind(this));
        this.router.get("/users", authenticate, authorize("editor"), this.users.bind(this));
        this.router.get("/users/get/:id", authenticate, this.getUserById.bind(this));
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

    private async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const { username, email, password, role } = req.body;

            const updated = await this.userService.updateUser(userId, {
                username,
                email,
                password,
                role
            });
            if (!updated.id) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            res.status(200).json(updated);
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    private async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);

            if (!req.user || (req.user.id !== userId && req.user.role !== "admin")) {
                res.status(403).json({ success: false, message: "Forbidden" });
                return;
            }

            const user = await this.userService.getUserById(userId);

            if (!user.id) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    public getRouter(): Router {
        return this.router;
    }
}