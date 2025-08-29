import type { BookDto } from "../../models/books/BookDto";
import { Bookmark } from "lucide-react";

type Props = {
  book: BookDto;
  onClick: (id: number) => void;
  onToggleFavorite?: (book: BookDto) => void;
  isFavorite?: boolean,
  isEditable?: boolean;
  onRemove?: (id: number) => void;
};

const BookCard = ({ book, onClick, onToggleFavorite, isFavorite, isEditable, onRemove }: Props) => (
  <li className="cards__item card-item-relative">
    <div className="card">
      <div
        className="card__image"
        style={{ backgroundImage: `url(${book.cover_image_url})` }}
      />
      <button
        className={`bookmark_btn ${isFavorite ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(book);
        }}
        aria-pressed={!!isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Bookmark className="bookmark" />
      </button>
      <div className="card__content">
        <div className="card__title">{book.title}</div>
        <p className="card__text">{book.author}</p>
        <p className="card__text">
          {book.summary ? book.summary.slice(0, 100) + "..." : ""}
        </p>
        <button onClick={() => onClick(book.id)} className="btnDetails">
          Details
        </button>
      </div>
    </div>

    {isEditable && onRemove && (
      <button
        className="btnRemove"
        onClick={() => onRemove(book.id)}
        aria-label="Remove from featured"
        title="Remove from featured"
      >
        ×
      </button>
    )}
  </li>
);

export default BookCard;
