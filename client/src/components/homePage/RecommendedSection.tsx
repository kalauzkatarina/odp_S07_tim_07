import { useRef } from "react";
import type { BookDto } from "../../models/books/BookDto";
import BooksList from "./BooksList";

type Props = {
  books: BookDto[];
  allBooks: BookDto[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onRemove: (id: number) => void;
  onAdd: (id: number) => void;
  selectedBookId: number | "";
  setSelectedBookId: (id: number | "") => void;
  isEditor: boolean;
  onClickBook: (id: number) => void;
};

const RecommendedSection = ({
  books,
  allBooks,
  isEditing,
  onToggleEdit,
  onRemove,
  onAdd,
  selectedBookId,
  setSelectedBookId,
  isEditor,
  onClickBook,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="section section--recommended">
      <div className="row row-between row-center spacing-mb">
        {isEditor && (
          <button
            className="btnEdit"
            onClick={() => {
              if (isEditing) {
                ref.current?.scrollIntoView({ behavior: "smooth" });
              }
              onToggleEdit();
            }}
          >
            {isEditing ? "End" : "Edit"}
          </button>
        )}
      </div>

      <BooksList
        books={books}
        onClick={onClickBook}
        editable={isEditing}
        onRemove={onRemove}
      />

      {isEditing && (
        <div className="row">
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
            className="form-select-featured"
          >
            <option value="">Select a book</option>
            {allBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
          <button
            className="btnAddFb"
            onClick={() => selectedBookId && onAdd(selectedBookId)}
            disabled={!selectedBookId}
          >
            Add a new featured book
          </button>
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
