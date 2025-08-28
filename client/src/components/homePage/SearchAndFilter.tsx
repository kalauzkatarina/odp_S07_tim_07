import type { GenreDto } from "../../models/genres/GenreDto";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  genres: GenreDto[];
  selectedGenre: number | "";
  onGenreChange: (value: number | "") => void;
};

const SearchAndFilter = ({
  search,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
}: Props) => (
  <div className="section-header">
    <input
      type="text"
      placeholder="Search by the title or author..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="form-input spacing-mb"
    />

    <div className="row row-gap spacing-mb">
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(Number(e.target.value) || "")}
        className="form-select"
      >
        <option value="">Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SearchAndFilter;
