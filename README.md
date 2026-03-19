# Vehicle Rental Portal

A full-stack web application for renting vehicles, built with React (frontend) and Node.js/Express (backend) with MongoDB.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Vehicle Management**: Browse available vehicles with filtering options
- **Booking System**: Book vehicles for specific dates
- **Admin Dashboard**: Manage vehicles, bookings, and users
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- React Hot Toast (notifications)
- Date-fns (date handling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- CORS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle-rental-portal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/vehicle-rental
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

3. **Frontend Setup**
   ```bash
   cd ../Client
   npm install
   ```

## Running the Application

1. **Start MongoDB**
   Make sure MongoDB is running on your system.

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

3. **Start Frontend Development Server**
   ```bash
   cd Client
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration

- `POST /api/auth/login` - User login

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add new vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle (Admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status (Admin only)

## Project Structure

```
vehicle-rental-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── Client/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── index.html
    └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.