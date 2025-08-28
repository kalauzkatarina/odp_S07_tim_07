import type { BookDto } from "../../models/books/BookDto";
import BookCard from "./BookCard";

type Props = {
  books: BookDto[];
  onClick: (id: number) => void;
  editable?: boolean;
  onRemove?: (id: number) => void;
};

const BooksList = ({ books, onClick, editable, onRemove }: Props) => (
  <ul className="cards">
    {books.map((b) => (
      <BookCard
        key={b.id}
        book={b}
        onClick={onClick}
        isEditable={editable}
        onRemove={onRemove}
      />
    ))}
  </ul>
);

export default BooksList;
