# Car Rental Platform

A full-stack web application for seamless car rental booking and management. Users can browse, book, and manage car rentals, while owners can list and oversee their vehicles and bookings. The platform features a modern, intuitive interface and secure authentication.

## Features

- User registration and login
- Browse available cars with images and details
- Book cars for specific dates
- View and manage your bookings
- Car owners can list, update, and remove their vehicles
- Real-time booking status updates
- Responsive and user-friendly design

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Other:** dotenv, bcrypt, cors

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/car-rental-platform.git
   cd car-rental-platform
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   cd carrental
   npm install
   cd ../server
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `server` directory with the following:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

5. **Start the frontend:**
   ```bash
   cd ../carrental
   npm run dev
   ```

6. **Figma Design:**
   [https://www.figma.com/design/U0v1IAFNfsId1WOiX4CpCD/Car-Rental-Figma?node-id=0-1&p=f&t=9mlCX3ZPbEO9HaJK-0]

## Folder Structure

```
carrental/      # React frontend
server/         # Node.js/Express backend
```


**Developed by:** Udayan Alone
