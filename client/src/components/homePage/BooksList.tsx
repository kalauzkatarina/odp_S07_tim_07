import type { BookDto } from "../../models/books/BookDto";
import BookCard from "./BookCard";

type Props = {
  books: BookDto[];
  onClick: (id: number) => void;
  onToggleFavorite?: (book: BookDto) => void;
  favoriteBooks?: BookDto[];
  editable?: boolean;
  onRemove?: (id: number) => void;
};

const BooksList = ({ books, onClick, onToggleFavorite, favoriteBooks, editable, onRemove }: Props) => (
  <ul className="cards">
    {books.map((b) => (
      <BookCard
        key={b.id}
        book={b}
        onClick={onClick}
        onToggleFavorite={onToggleFavorite}
        isFavorite={favoriteBooks?.some((book) => book.id === b.id)}
        isEditable={editable}
        onRemove={onRemove}
      />
    ))}
  </ul>
);

export default BooksList;
