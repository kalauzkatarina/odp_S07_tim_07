import Select from "react-select";
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
}: Props) => {
  const options = genres.map((g) => ({ value: g.id, label: g.name }));

  return (
    <div className="section-header">
      <input
        type="text"
        placeholder="Search by the title or author..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="form-input spacing-mb"
      />

      <div className="select-genres">
        <Select
          options={options}
          value={selectedGenre ? options.find((o) => o.value === selectedGenre) : null}
          onChange={(option) => onGenreChange(option ? option.value : "")}
          placeholder="Genres"
          isClearable
          styles={{
            control: (provided) => ({
              ...provided,
              borderRadius: 20,
              borderColor: "#ccc",
              minHeight: 40,
              width: 200,
              boxShadow: "none",
              "&:focus": { outline: "none" },
            }),
            menu: (provided) => ({
              ...provided,
              borderRadius: 20,
              width: 200,
              backgroundColor: "#faf6f6"
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "#dfc2c2"
                : state.isFocused
                  ? "#dfc2c2"
                  : "#faf6f6",
              color: state.isSelected
                ? "#faf6f6"        // boja teksta selektovane opcije
                : state.isFocused
                  ? "#000"        // boja teksta hover
                  : "#321d1d",    // normalna boja teksta
              cursor: "pointer",
              borderRadius: "20px",
              outline: "none", // uklanja outline na opcijama
              boxShadow: "none",
              ":active": { outline: "none", boxShadow: "none" },
              ":focus": { outline: "none", boxShadow: "none" },
              "&:focus-visible": { outline: "none", boxShadow: "none" },
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "#321d1d",
            }),
            input: (provided) => ({
              ...provided,
              outline: "none",
              boxShadow: "none",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;