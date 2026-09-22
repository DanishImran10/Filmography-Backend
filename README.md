
# ⚙️ Backend README

```md
# Movie Watchlist Backend

A RESTful API backend for a movie watchlist application built using **Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM**. This backend handles authentication, movie data management, watchlist functionality, search, and pagination.

---

## Features

* **RESTful API Architecture**
  - Clean separation of routes, controllers, and services
  - Scalable endpoint structure

---

* **Database Integration (PostgreSQL + Prisma)**
  - Relational schema design for users, movies, and watchlist entries
  - Type-safe database queries using Prisma ORM

---

* **Authentication System**
  - JWT-based authentication
  - Secure HTTP-only cookie storage
  - Middleware-based route protection

---

* **Watchlist Management**
  - Add/remove movies from user watchlist
  - User-specific relational mapping via Prisma

---

* **Search & Filtering**
  - Case-insensitive movie search using Prisma queries
---

* **Pagination Support**
  - Server-side pagination using `skip` and `take`
  - Optimized query handling for large datasets

---

* **Middleware System**
  - Authentication middleware for protected routes
  - Error handling middleware for consistent API responses

---

* **Type Safety**
  - Fully typed request/response handling using TypeScript
  - Custom Express type augmentation (e.g., `req.user`)

---

## API Endpoints (Sample)

* `GET /api/movies/trending` → Get trending movies
* `GET /api/movies?page=1&limit=20` → Fetch first 20 movies
* `GET /api/movies/search?search=the` → Get all movies containing 'the'
* `POST /api/watchlist` → Add movie to the watchlist
* `DELETE /api/watchlist/:movieId` → Remove movie from the watchlist
* `POST /api/auth/login` → Sign in user

---

## Project Structure

```bash
src/
  ├── controllers/
  │     ├── authenticationRouteController.ts
  │     ├── moviesRouteController.ts
  │     └── watchlistRouteController.ts
  ├── routes/
  │     ├── authenticationRoute.ts
  │     ├── moviesRoute.ts
  │     └── watchlistRoute.ts
  ├── utils/
  │     ├── asyncHandler.ts
  │     └── decodeToken.ts
  ├── prisma/
  │     └── schema.prisma
  ├── dbConnect.ts
  └── server.ts
