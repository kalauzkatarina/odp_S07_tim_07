import { Request, Response, Router } from "express";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import jwt from "jsonwebtoken";
import { validationOfDatasAuth } from "../validators/auth/RegisterValidator";

export class AuthContoller{
    private router: Router;
    private authService: IAuthService;

    constructor(authService: IAuthService){
        this.router = Router();
        this.authService = authService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/auth/login', this.login.bind(this));
        this.router.post('/auth/register', this.register.bind(this));
    }

    private async login(req: Request, res: Response): Promise<void> {
        try{
            const { username, password} = req.body;

            const result = validationOfDatasAuth(username, password);

            if(!result.successful){
                res.status(400).json({ success: false, message: result.message });
                return;
            }

            const resultAuth = await this.authService.logIn(username, password);

            if(resultAuth.id !== 0){
                const token = jwt.sign(
                    {
                        id: resultAuth.id,
                        username: resultAuth.username,
                        email: resultAuth.email,
                        role: resultAuth.role,
                    }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

                res.status(200).json({ success: true, message: 'Successfully logged in', data: token});
                return;
            } else {
                res.status(401).json({ success: false, message: 'Unvalid username or password' });
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }

    private async register(req: Request, res: Response): Promise<void> {
        try{
            const { username, password, email, role} = req.body;
            const result = validationOfDatasAuth(username, password);

            if(!result.successful){
                res.status(400).json({ success: false, message: result.message });
                return;
            }

            const resultAuth = await this.authService.signUp(username, password, email, role);
            if(resultAuth.id !== 0){
                const token = jwt.sign(
                    {
                        id: resultAuth.id,
                        username: resultAuth.username,
                        email: resultAuth.email,
                        role: resultAuth.role,
                    }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });
                
                res.status(201).json({ success: true, message: 'Successfully signed up', data: token});
            } else {
                res.status(401).json({success: false, message: 'Signing up is unsuccessful. Username already exists.'});
            }

        } catch (error) {
            res.status(500).json({success: false, message: error});
        }
    }

  public getRouter(): Router {
    return this.router;
  }
}