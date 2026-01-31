# Gari Chai Server

A Node.js/Express API server for the Gari Chai car rental application.

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_USER=your_db_username
DB_PASS=your_db_password
```

3. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Health Check

- `GET /health` - Check server status

### Authentication

- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout and clear token

### Cars

- `GET /api/cars` - Get all cars (public)
- `GET /api/cars/user/cars` - Get user's cars (requires auth)
- `GET /api/cars/:id` - Get single car (public)
- `POST /api/cars` - Add new car (requires auth)
- `PATCH /api/cars/:id` - Update car (requires auth)
- `DELETE /api/cars/:id` - Delete car (requires auth)

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings (requires auth)
- `GET /api/bookings/car/:id` - Get car bookings (requires auth)
- `PATCH /api/bookings/:id` - Update booking (requires auth)
- `PATCH /api/bookings/:id/status` - Update booking status (requires auth)
- `DELETE /api/bookings/:id` - Delete booking (requires auth)

### Reviews

- `POST /api/reviews` - Add review
- `GET /api/reviews/car/:id` - Get car reviews
- `GET /api/reviews/user/reviews` - Get user reviews (requires auth)
- `PATCH /api/reviews/:id` - Update review (requires auth)
- `DELETE /api/reviews/:id` - Delete review (requires auth)

## Environment Variables

| Variable      | Description               | Required                     |
| ------------- | ------------------------- | ---------------------------- |
| `PORT`        | Server port               | No (defaults to 5000)        |
| `NODE_ENV`    | Environment mode          | No (defaults to development) |
| `JWT_SECRET`  | JWT signing secret        | Yes                          |
| `MONGODB_URI` | MongoDB connection string | Yes                          |
| `DB_USER`     | MongoDB username          | Yes                          |
| `DB_PASS`     | MongoDB password          | Yes                          |

## Development

The server uses ES modules and includes:

- Express.js for API routing
- Mongoose for MongoDB integration
- JWT for authentication
- Joi for input validation
- CORS support
- Request logging

## Project Structure

```
server/
├── index.js              # Main server file
├── config/               # Configuration files
├── controllers/          # Business logic
├── middleware/           # Custom middleware
├── models/               # MongoDB schemas
├── routes/               # API routes
└── utils/                # Utility functions
```
