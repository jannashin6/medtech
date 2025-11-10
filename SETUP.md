# 🚀 Quick Setup Guide

## Step 1: Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `env.example`):
   ```bash
   cp env.example .env
   ```

4. Update `.env` with your credentials:
   - **MONGODB_URI**: Get from MongoDB Atlas dashboard
   - **JWT_SECRET**: Generate a random secure string
   - **CEREBRAS_API_KEY**: Get from Cerebras API dashboard
   - **CEREBRAS_API_URL**: Verify the correct endpoint from Cerebras documentation

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server should start on `http://localhost:5000`

## Step 2: Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend should start on `http://localhost:3000`

## Step 3: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

## Step 4: Cerebras API Setup

1. Sign up for Cerebras API access
2. Get your API key from the dashboard
3. Update `CEREBRAS_API_KEY` in `.env`
4. **Note**: Verify the API endpoint URL in Cerebras documentation and update `CEREBRAS_API_URL` if needed

## Step 5: Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account (as patient or doctor)
3. Test the AI chat feature
4. Browse doctors and book appointments

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Check your `MONGODB_URI` and ensure your IP is whitelisted
- **Port Already in Use**: Change `PORT` in `.env` to a different port
- **Cerebras API Error**: Verify your API key and endpoint URL

### Frontend Issues
- **API Connection Error**: Ensure backend is running and `VITE_API_URL` is correct
- **Build Errors**: Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Production Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Deploy the `server/` directory
4. Update `FRONTEND_URL` to your frontend domain

### Frontend (Netlify/Vercel)
1. Build the app: `npm run build`
2. Deploy the `dist/` folder
3. Set `VITE_API_URL` environment variable to your backend URL

## Next Steps

- Add more doctor profiles through the registration (select "Doctor" role)
- Test all features: chat, doctor search, appointment booking
- Customize the UI colors and branding in `tailwind.config.js`
- Add more specializations and features as needed

