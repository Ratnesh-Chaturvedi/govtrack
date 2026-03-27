# Civic Integrity AI - Backend API

MERN Stack Backend for Civic Integrity AI Platform with MongoDB integration and multi-role authentication.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/civic-integrity-ai
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/civic-integrity-ai

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update MONGODB_URI in .env

### 4. Run the Server

**Development Mode (with auto-reload)**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

The server will start at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── auth.js              # JWT & error handling
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   └── server.js                # Express app
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── .gitignore                   # Git ignore
└── package.json
```

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+91999999999",
  "role": "citizen",
  "identificationId": "123456789",
  "identificationType": "aadhaar",
  "citizenship": {
    "district": "Bangalore",
    "state": "Karnataka",
    "country": "India"
  }
}
```

**Roles:** `citizen`, `official`, `contractor`, `media`

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "citizen",
      "identificationId": "CIT-123456-ABCDE"
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "citizen"
    }
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## 📝 User Roles & Fields

### Citizen
- Identification Type: `aadhaar`, `voter_id`
- Fields: `citizenship` (district, state, country)

### Government Official
- Identification Type: `employee_id`
- Fields: `official` (department, designation, office location)

### Contractor
- Identification Type: `license_id`
- Fields: `contractor` (company, registration, GST, bank info)

### Media/Audit
- Identification Type: `audit_license`
- Fields: `media` (organization, license, specialization)

## 🔑 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**To authenticate requests:**
1. Register or login to get a token
2. Include in request header: `Authorization: Bearer <token>`
3. Token expires in 7 days (configurable via JWT_EXPIRE)

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Account lockout after 5 failed login attempts (30 minutes)
- Role-based access control
- CORS protection
- Input validation

## 📚 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email Validation:** validator

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity (for MongoDB Atlas)

### CORS Issues
- Update CORS_ORIGIN in .env with your frontend URL
- Check that frontend is using correct API URL

### Token Expired
- Refresh token by logging in again
- Increase JWT_EXPIRE if needed

## 📖 Documentation

For API documentation, you can use tools like:
- Postman: https://www.postman.com/
- Insomnia: https://insomnia.rest/

Import the API endpoints listed above to start testing.

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

Civic Integrity AI Team

---

**Built with ❤️ for transparent governance**
