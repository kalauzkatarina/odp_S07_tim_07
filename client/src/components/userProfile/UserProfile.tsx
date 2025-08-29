import { useEffect, useState } from "react";

import "./UserProfile.css"
import type { BookDto } from "../../models/books/BookDto";
import BooksList from "../homePage/BooksList";

interface UserFormProps {
  username: string;
  email: string;
  onSave: (updatedUser: { username: string; email: string; password?: string }) => void;
  favoriteBooks?: BookDto[];
  onToggleFavorite?: (book: BookDto) => void;
}

export function UserForm({
  username: initialUsername,
  email: initialEmail,
  onSave,
  favoriteBooks = [],
  onToggleFavorite
}: UserFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    setUsername(initialUsername);
    setEmail(initialEmail);
  }, [initialUsername, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ username, email, password: password || undefined });
    setPassword("");
    setIsEditing(false);
    alert("Users data updated successfully.");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label-user-profile" htmlFor="chk" aria-hidden="true">
        User Profile
      </label>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={!isEditing}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={!isEditing}
        required
      />

      <input
        type="password"
        placeholder="************"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={!isEditing}
      />

      <button type="submit" className="btnSave">
        Save
      </button>

      <div className="users-library">
        <h2 className="users-library-header">User's Library</h2>
        {favoriteBooks.length > 0 ? (
          <BooksList
            books={favoriteBooks}
            onClick={() => { }}
            onToggleFavorite={onToggleFavorite}
            favoriteBooks={favoriteBooks}
          />
        ) : (
          <p>No favorite books yet.</p>
        )}
      </div>
    </form>


  );
}
