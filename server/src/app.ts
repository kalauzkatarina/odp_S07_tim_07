import express from 'express';
import cors from 'cors';
import { IUserRepository } from './Domain/repositories/IUserRepository';
import { UserRepository } from './Database/repositories/UserRepository';
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { AuthContoller } from './WebAPI/controllers/AuthController';
import { UserController } from './WebAPI/controllers/UserController';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get<{}, {data: string}>('/', (req, res) => {
  res.json({
    data: "response",
  });
});

//Repositories
const userRepository: IUserRepository = new UserRepository();

//Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);

//WebAPI routes
const authController = new AuthContoller(authService);
const userController = new UserController(userService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());

export default app;
