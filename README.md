# Coffee Shop API

A RESTful API for managing a coffee shop menu, built with Node.js, Express, and MongoDB. Features JWT authentication, Joi input validation, full CRUD operations for menu items, user profile management, and external Coffee API integration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Password Hashing**: bcryptjs
- **External API**: [TheCocktailDB](https://www.thecocktaildb.com/) via axios
- **Dev Tooling**: nodemon

## Project Structure

```
coffee-shop/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── authController.js      # Register & login logic
│   ├── menuController.js      # CRUD for menu items + external API
│   └── userController.js      # User profile get & update
├── middleware/
│   ├── auth.js                # JWT authentication middleware
│   ├── errorHandler.js        # Global error handling middleware
│   └── validate.js            # Joi validation middleware
├── models/
│   ├── MenuItem.js            # Menu item Mongoose schema
│   └── User.js                # User Mongoose schema with bcrypt
├── public/
│   └── index.html             # Frontend interface
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── menuRoutes.js          # Menu CRUD endpoints
│   └── userRoutes.js          # User profile endpoints
├── validators/
│   ├── authValidator.js       # Joi schemas for register & login
│   ├── menuValidator.js       # Joi schemas for menu item create & update
│   └── userValidator.js       # Joi schema for profile update
├── .env                       # Environment variables (not committed)
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore rules
├── docker-compose.yml         # Docker setup for MongoDB
├── package.json               # Dependencies and scripts
├── README.md                  # This file
└── server.js                  # Application entry point
```

## Prerequisites

- Node.js (v18+)
- MongoDB (local instance or Docker)

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
    cd coffee-shop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** — copy `.env.example` to `.env` and update the values:
   ```
   PORT=3000
    MONGO_URI=mongodb://localhost:27017/coffee-shop
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Start MongoDB** (if using Docker):
   ```bash
   docker-compose up -d
   ```

5. **Run the server**:
   ```bash
   # Production
   npm start

   # Development (auto-restart on file changes)
   npm run dev
   ```

   Server runs at `http://localhost:3000`.

## API Endpoints

### Authentication

| Method | Endpoint             | Access | Description             |
|--------|----------------------|--------|-------------------------|
| POST   | `/api/auth/register` | Public | Register a new user     |
| POST   | `/api/auth/login`    | Public | Login and receive token |

### User Profile

| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| GET    | `/api/users/profile`  | Private | Get current user     |
| PUT    | `/api/users/profile`  | Private | Update current user  |

### Menu Items (CRUD)

| Method | Endpoint          | Access  | Description              |
|--------|-------------------|---------|--------------------------|
| POST   | `/api/menu`       | Private | Create a menu item       |
| GET    | `/api/menu`       | Private | Get all user's menu items|
| GET    | `/api/menu/:id`   | Private | Get a single menu item   |
| PUT    | `/api/menu/:id`   | Private | Update a menu item       |
| DELETE | `/api/menu/:id`   | Private | Delete a menu item       |

### External API

| Method | Endpoint                    | Access | Description                          |
|--------|-----------------------------|--------|--------------------------------------|
| GET    | `/api/menu/external/coffee` | Public | Fetch coffee data from external API  |

> **Private** routes require a JWT token in the `Authorization` header:
> ```
> Authorization: Bearer <your-token>
> ```

## API Usage Examples

### 1. Register

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully.",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Get Profile (Protected)

```
GET /api/users/profile
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Profile (Protected)

```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated"
}
```

### 5. Create Menu Item (Protected)

```
POST /api/menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cappuccino",
  "description": "Classic Italian espresso drink",
  "price": 4.50,
  "category": "hot",
  "available": true
}
```

**Response** (201):
```json
{
  "message": "Menu item created successfully.",
  "menuItem": {
    "_id": "...",
    "name": "Cappuccino",
    "description": "Classic Italian espresso drink",
    "price": 4.5,
    "category": "hot",
    "image": "",
    "available": true,
    "user": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 6. Get All Menu Items (Protected)

```
GET /api/menu
Authorization: Bearer <token>
```

### 7. Get Single Menu Item (Protected)

```
GET /api/menu/:id
Authorization: Bearer <token>
```

### 8. Update Menu Item (Protected)

```
PUT /api/menu/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 5.00,
  "available": false
}
```

### 9. Delete Menu Item (Protected)

```
DELETE /api/menu/:id
Authorization: Bearer <token>
```

### 10. External Coffee API (Public)

```
GET /api/menu/external/coffee
```

This endpoint fetches coffee and tea recipes from [TheCocktailDB](https://www.thecocktaildb.com/), a free, open-source database of drink recipes.

**Response** (200):
```json
{
  "source": "https://www.thecocktaildb.com",
  "count": 25,
  "coffeeItems": [
    {
      "id": "12770",
      "name": "Iced Coffee",
      "instructions": "Mix together until coffee and sugar is dissolved. Add milk. Shake well...",
      "category": "Coffee / Tea",
      "glass": "Coffee mug",
      "image": "https://www.thecocktaildb.com/images/media/drink/ytprxy1454513855.jpg",
      "alcoholic": "Non alcoholic",
      "ingredients": [
        { "ingredient": "Coffee", "measure": "1/4 cup instant" },
        { "ingredient": "Sugar", "measure": "1/4 cup" },
        { "ingredient": "Water", "measure": "1/4 cup hot" },
        { "ingredient": "Milk", "measure": "4 cups cold" }
      ]
    }
  ]
}
```

## Validation Rules

### Register
| Field    | Rules                            |
|----------|----------------------------------|
| name     | Required, 2-50 characters        |
| email    | Required, valid email format      |
| password | Required, 6-128 characters        |

### Login
| Field    | Rules                            |
|----------|----------------------------------|
| email    | Required, valid email format      |
| password | Required                          |

### Update Profile
| Field    | Rules                            |
|----------|----------------------------------|
| name     | Optional, 2-50 characters        |
| email    | Optional, valid email format      |
| password | Optional, 6-128 characters        |

> At least one field must be provided.

### Create Menu Item
| Field       | Rules                                          |
|-------------|------------------------------------------------|
| name        | Required, 1-100 characters                      |
| description | Optional, max 500 characters                    |
| price       | Required, number, min 0                          |
| category    | Required, one of: hot, cold, pastry, snack       |
| image       | Optional, valid URI                              |
| available   | Optional, boolean (defaults to true)             |

### Update Menu Item
Same fields as create, but all optional. At least one field must be provided.

## Error Handling

The API uses a global error handler that returns consistent JSON responses:

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Validation error / Bad request |
| 401    | Unauthorized (missing/invalid/expired token) |
| 404    | Resource not found          |
| 409    | Conflict (duplicate email, etc.) |
| 502    | External API failure        |
| 500    | Internal server error       |

**Error response format**:
```json
{
  "message": "Description of what went wrong."
}
```

## Environment Variables

| Variable       | Description                    | Default                                      |
|----------------|--------------------------------|----------------------------------------------|
| `PORT`         | Server port                    | `3000`                                       |
| `MONGO_URI`    | MongoDB connection string      | `mongodb://localhost:27017/coffee-shop`  |
| `JWT_SECRET`   | Secret key for signing JWTs    | -                                            |
| `JWT_EXPIRES_IN` | Token expiration duration    | `7d`                                         |

## Live Demo

**Live URL**: [https://coffee-shop-13u6.onrender.com](https://coffee-shop-13u6.onrender.com)

## Deployment (Render)

The application is deployed on [Render](https://render.com) with MongoDB Atlas as the cloud database.

### Prerequisites

- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free M0 cluster)
- A [Render](https://render.com) account
- A [GitHub](https://github.com) repository with the project code

### MongoDB Atlas Setup

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Under **Database Access**, create a database user with a password
3. Under **Network Access**, add `0.0.0.0/0` to allow connections from Render
4. Click **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/coffee-shop?retryWrites=true&w=majority
   ```

### Render Deployment

1. Push the project to a GitHub repository
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `coffee-shop`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the following **Environment Variables**:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random secret key
   - `JWT_EXPIRES_IN` = `7d`
6. Click **Deploy**

The `PORT` variable is automatically set by Render — do not add it manually.
