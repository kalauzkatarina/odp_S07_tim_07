# Bukvarijum — Smart Digital Book Catalog

Bukvarijum is a full-stack web application designed as a digital catalog of books with user accounts, content management, and dynamic homepage sections.  
The system includes authentication, authorization with role-based access control, book management, comments, and advanced browsing features.

This project was developed as part of the **PZ S07** course, under the supervision of assistant **Danijel Jovanović**.

---

## Features Overview

### User Roles
Bukvarijum supports two user types:

#### **Visitor**
- Browse all books
- Search books by:
  - Title
  - Author
- Filter by genre
- View complete book information:
  - Title  
  - Author  
  - Genres  
  - Short description  
  - Format  
  - Number of pages  
  - Script  
  - Binding  
  - Publishing date  
  - ISBN  
  - Cover image  
- Leave public comments on book pages

#### **Editor**
Includes all Visitor permissions plus:
- Add new books
- Edit existing books
- Assign one or multiple genres when creating or editing a book
- Highlight selected books in special homepage sections

---

## Homepage Sections

### **Bestsellers**
Displays **three most visited** books on the platform.

### **New Releases**
Shows **five latest added** books, with the option to view the full list sorted by date.

### **Don't Judge a Book by Its Cover**
A special editor-curated section featuring **up to five recommended books**, regardless of popularity.

---

## Book Details Page

Each book has its own dedicated page containing:
- Complete metadata  
- Cover image  
- Public comment section  
- Comments visible to all visitors  

---

## Authentication & Authorization

- JWT-based authentication between client and server  
- Role-based access control (Visitor / Editor)  
- Protected routes on the client  
- Custom 404 page  
- Shared Authentication Context across the app  
- Client-side and server-side input validation  

---

## Technologies & Architecture

### **Backend**
- TypeScript  
- Node.js  
- Express  
- Relational database (MySQL)  
- JWT authentication  
- Clean Architecture  
- SOLID principles applied  
- Data validation (server-side)

### **Frontend**
- TypeScript  
- React  
- Protected Routes  
- Authentication Context Provider  
- TailwindCSS or Bootstrap 5 for styling (We used CSS and a bit of Bootstrap)
- Client-side validation  

---

##  Running the Application

### **Backend**
```bash
cd server
npm install
npm run dev
```
### **Frontend**
```bash
cd client
npm install
npm run dev
```
