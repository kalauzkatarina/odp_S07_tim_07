import { useRef } from "react";
import type { BookDto } from "../../models/books/BookDto";
import BooksList from "./BooksList";

type Props = {
  books: BookDto[];
  isEditing: boolean;
  onToggleEdit: () => void;
  isEditor: boolean;
  onClickBook: (id: number) => void;
  onRemove: (id: number) => void;
};

const RecommendedSection = ({
  books,
  isEditing,
  onToggleEdit,
  isEditor,
  onClickBook,
  onRemove,
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
    </section>
  );
};

export default RecommendedSection;
