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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);