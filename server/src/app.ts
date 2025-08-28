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
import { ICommentRepository } from './Domain/repositories/ICommentRepository';
import { CommentRepository } from './Database/repositories/CommentRepository';
import { ICommentService } from './Domain/services/comments/ICommentService';
import { CommentService } from './Services/comments/CommentService';
import { CommentController } from './WebAPI/controllers/CommentController';
import { IGenreRepository } from './Domain/repositories/IGenreRepository';
import { GenreRepository } from './Database/repositories/GenreRepository';
import { IGenreService } from './Domain/services/genres/IGenreService';
import { GenreService } from './Services/genres/GenreService';
import { GenreController } from './WebAPI/controllers/GenreController';
import { IBookRepository } from './Domain/repositories/IBooksRepository';
import { BookRepository } from './Database/repositories/BookRepository';
import { IBookService } from './Domain/services/books/IBookService';
import { BookService } from './Services/books/BookService';
import { IBookGenreRepository } from './Domain/repositories/IBookGenreRepository';
import { BookGenreRepository } from './Database/repositories/BookGenreRepository';
import { BookController } from './WebAPI/controllers/BookController';
import { IFeaturedBookService } from './Domain/services/featuredBooks/IFeaturedBookService';
import { IFeaturedBooksRepository } from './Domain/repositories/IFeaturedBooksRepository';
import { FeaturedBooksRepository } from './Database/repositories/FeaturedBooksRepository';
import { FeaturedBookService } from './Services/featuredBooks/FeaturedBookService';
import { FeaturedBookController } from './WebAPI/controllers/FeaturedBookController';
import { IFavoriteBooksRepository } from './Domain/repositories/IFavoriteBooksRepository';
import { FavoriteBooksRepository } from './Database/repositories/FavoriteBooksRepository';
import { IFavoriteBookService } from './Domain/services/favoriteBooks/IFavoriteBooksService';
import { FavoriteBookService } from './Services/favoriteBooks/FavoriteBooksService';
import { FavoriteBookController } from './WebAPI/controllers/FavoriteBooksController';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get<{}, { data: string }>('/', (req, res) => {
  res.json({
    data: "response",
  });
});

const userRepository: IUserRepository = new UserRepository();
const commentRepository: ICommentRepository = new CommentRepository();
const genreRepository: IGenreRepository = new GenreRepository();
const bookRepository: IBookRepository = new BookRepository();
const bookGenreRepository: IBookGenreRepository = new BookGenreRepository();
const featuredBookRepository: IFeaturedBooksRepository = new FeaturedBooksRepository();
const favoriteBooksRepository: IFavoriteBooksRepository = new FavoriteBooksRepository();

const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const commentService: ICommentService = new CommentService(commentRepository, userRepository);
const genreService: IGenreService = new GenreService(genreRepository);
const bookService: IBookService = new BookService(bookRepository, bookGenreRepository, genreRepository);
const featuredBookService: IFeaturedBookService = new FeaturedBookService(featuredBookRepository, bookRepository);
const favoriteBooksService: IFavoriteBookService = new FavoriteBookService(favoriteBooksRepository, bookRepository);

const authController = new AuthContoller(authService);
const userController = new UserController(userService);
const commentController = new CommentController(commentService);
const genreController = new GenreController(genreService);
const bookController = new BookController(bookService);
const featuredBookController = new FeaturedBookController(featuredBookService);
const favoriteBookController = new FavoriteBookController(favoriteBooksService);

app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', commentController.getRouter());
app.use('/api/v1', genreController.getRouter());
app.use('/api/v1', bookController.getRouter());
app.use('/api/v1', featuredBookController.getRouter());
app.use('/api/v1', favoriteBookController.getRouter());

export default app;
