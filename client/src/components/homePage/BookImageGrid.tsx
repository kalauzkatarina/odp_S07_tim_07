import type { BookDto } from "../../models/books/BookDto";

type Props = {
  books: BookDto[];
  featuredBooks?: BookDto[];
  favoriteBooks?: BookDto[];
  onToggleFeatured: (book: BookDto) => void;
  onToggleFavorite: (book: BookDto) => void;
};

const BookImageGrid = ({ books, featuredBooks, onToggleFeatured }: Props) => {
  return (
    <div className="book-image-grid">
      {books.map((book) => {
        const isFeatured = featuredBooks?.some((b) => b.id === book.id);
        return (
          <div key={book.id} className="book-image-item">
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="book-image"
            />
            <button
              className={`btnFeatured ${isFeatured ? "remove" : "add"}`}
              onClick={() => onToggleFeatured(book)}
            >
              {isFeatured ? "Remove" : "Add"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BookImageGrid;
