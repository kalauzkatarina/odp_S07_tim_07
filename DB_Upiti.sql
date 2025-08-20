-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS DEFAULT_DB;

-- Koriscenje default baze podataka
USE DEFAULT_DB;

-- Kreiranje tabele za korisnike
CREATE TABLE IF NOT EXISTS books(
	id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(50) NOT NULL,
    genres ENUM('Fiction', 'Novel', 'Mystery', 'Narrative', 'Science fiction', 'Historical Fiction', 'Non-Fiction', 'Genre-Fiction', 'Thriller', 'Historical Romance', 'Young Adult Literature', 'Horror Fiction', 'Memoir', 'Romance Novel', 'Fantasy Fiction', 'Autobiography', 'Fantasy', 'Children Literature', 'Graphic Novel', 'Biography', 'Literary Fiction', 'Women Fiction', 'Crime Fiction', 'Self-Help Book', 'Short Story', 'Essay', 'High Fantasy', 'Adventure Fiction', 'History', 'Magical Realism', 'Humor', 'True Crime', 'Contemporary Romance', 'Science', 'Fairy Tale', 'Gothic Fiction', 'Contemporary Literature', 'Science Fantasy', 'Poetry', 'Travel Literature', 'Speculative Fiction', 'Scoial Science', 'Romance', 'Paranormal Romance', 'Western Fiction', 'Coming-of-age Story', 'Satire', 'New Adult Fiction', 'Historical Fantasy', 'Romantic Fantasy'),
    summary TEXT NOT NULL,
    format VARCHAR(50),
    pages INT,
    script VARCHAR(50),
    binding VARCHAR(50),
    publish_date DATE,
    isbn VARCHAR(20),
    cover_image_url VARCHAR(300),
<<<<<<< Updated upstream
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
=======
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS authors (
	id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS book_authors (
	book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE IF NOT EXISTS book_genres(
	book_id INT,
    genre_id INT,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS comments(
	id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    book_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS featured_books (
	id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    editor_id INT NOT NULL,   
    featured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (editor_id) REFERENCES users(id) ON DELETE CASCADE
>>>>>>> Stashed changes
);