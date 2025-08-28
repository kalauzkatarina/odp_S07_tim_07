import { useState } from "react";

interface UserFormProps {
  username: string;
  onSave: (updatedUser: { username: string; password?: string }) => void;
}

export function UserForm({ username: initialUsername, onSave }: UserFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ username, password: password || undefined });
    setPassword(""); 
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password: <small>(leave empty to keep current)</small></label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-save">Save Changes</button>
    </form>
  );
}