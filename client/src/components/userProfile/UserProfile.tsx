import { useEffect, useState } from "react";

import "./UserProfile.css"

interface UserFormProps {
  username: string;
  email: string;
  onSave: (updatedUser: { username: string; email: string; password?: string }) => void;
}

export function UserForm({
  username: initialUsername,
  email: initialEmail,
  onSave,
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
      <label htmlFor="chk" aria-hidden="true">
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

        <button type="submit" className="btn">
          Save
        </button>
    </form>
  );
}
