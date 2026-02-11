# Backend Documentation - Video Games API

## Tech Stack Justification

### 1. **Node.js**:
   - **Reason**: Non-blocking I/O model makes it efficient for handling concurrent API requests. Unified language (JavaScript) for both frontend (React) and backend reduces context switching.
   - **Performance**: V8 engine ensures high performance.

### 2. **Express.js**:
   - **Reason**: Minimalist and flexible web application framework for Node.js. It provides a robust set of features for web and mobile applications without obscuring Node.js features.
   - **Ecosystem**: Massive middleware ecosystem (CORS, Body-parser, etc.).

### 3. **JSON Database (Custom Implementation)**:
   - **Reason**: Simplicity and portability for this specific project scope. It avoids the overhead of setting up a full database server (like MongoDB or PostgreSQL) while still simulating data persistence.
   - **Migration**: Can be easily swapped for a real DB later by replacing the `utils/db.js` layer.

### 4. **JWT (JSON Web Tokens)**:
   - **Reason**: Stateless authentication. The server doesn't need to keep session state, making it scalable and perfect for REST APIs.
   - **Security**: Signed tokens ensure data integrity.

## Features

- **Authentication**: User registration and login with JWT.
- **Roles**: `admin` and `user` roles.
- **CRUD**: Full Create, Read, Update, Delete operations for video games.
- **Pagination**: Efficient data loading for lists.
- **Security**: Password hashing (bcryptjs) and protected endpoints.
- **Containerization**: Docker support for easy deployment.
