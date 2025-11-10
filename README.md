HEAD
# 🏥 MedTech - Medical Smart Assistant Web App

A full-stack medical platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring AI-powered conversation using Cerebras API for symptom analysis and doctor recommendations.

## ✨ Features

- **AI-Powered Chat Assistant**: Chat with an intelligent AI assistant powered by Cerebras API for symptom analysis and medical recommendations
- **Doctor Discovery**: Browse through verified doctors with detailed profiles, ratings, and specializations
- **Appointment Booking**: Book and manage appointments with real-time updates
- **User Authentication**: Secure JWT-based authentication with role-based access (Patient/Doctor)
- **Modern UI**: Clean, responsive design inspired by Practo with smooth animations
- **Real Database**: Connected to MongoDB Atlas (not dummy data)

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **Cerebras API** - AI-powered medical conversations
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library with Hooks
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 📁 Project Structure

```
medtech/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── aiController.js    # Cerebras API integration
│   │   ├── doctorController.js
│   │   └── appointmentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── appointmentRoutes.js
│   ├── middlewares/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js
│   ├── app.js                  # Express app setup
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Doctors.jsx
│   │   │   └── Appointments.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js          # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cerebras API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medtech
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Create `.env` file in `server/` directory**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medtech?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   CEREBRAS_API_KEY=your_cerebras_api_key_here
   CEREBRAS_API_URL=https://api.cerebras.ai/v1
   FRONTEND_URL=http://localhost:3000
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Create `.env` file in `client/` directory (optional)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### AI Chat
- `POST /api/ai/chat` - Send message to AI assistant (Protected)
- `GET /api/ai/chat/history` - Get chat history (Protected)
- `DELETE /api/ai/chat/history` - Clear chat history (Protected)

### Doctors
- `GET /api/doctors` - Get all doctors (with filters)
- `GET /api/doctors/:id` - Get single doctor
- `GET /api/doctors/specializations` - Get all specializations
- `POST /api/doctors` - Create/update doctor profile (Doctor only)

### Appointments
- `POST /api/appointments` - Create appointment (Protected)
- `GET /api/appointments` - Get user appointments (Protected)
- `GET /api/appointments/:id` - Get single appointment (Protected)
- `PUT /api/appointments/:id` - Update appointment (Protected)
- `DELETE /api/appointments/:id` - Cancel appointment (Protected)

## 🔐 Authentication

The app uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🎨 UI Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Animations**: Smooth transitions using Framer Motion
- **Clean Interface**: Inspired by Practo's design language
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Proper loading indicators throughout

## 🧪 Testing

Use Postman or any API client to test the endpoints. Make sure to:
1. Register/login to get a JWT token
2. Include the token in Authorization header for protected routes
3. Test all CRUD operations

## 🚢 Deployment

### Backend (Render/Railway)
1. Set environment variables in your hosting platform
2. Deploy the `server/` directory
3. Update `FRONTEND_URL` in `.env`

### Frontend (Netlify/Vercel)
1. Build the app: `npm run build`
2. Deploy the `dist/` folder
3. Set `VITE_API_URL` to your backend URL

## 📝 Notes

- All chat conversations are stored in MongoDB for future reference
- Doctor profiles are linked to user accounts
- Appointments support real-time status updates
- The AI assistant provides context-aware responses with symptom tracking

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

# medtech
700d99283736947f6061b6cf97b6762386ad69c0
