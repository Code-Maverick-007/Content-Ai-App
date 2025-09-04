# Content AI - Backend Server

This is the backend server for the Content AI application, built with Node.js, Express, and various cloud services.

## 🚀 Features

- User authentication with Clerk
- File uploads with Cloudinary
- Database with Neon (PostgreSQL)
- AI content generation with Google's Gemini API
- Secure API endpoints with rate limiting
- Comprehensive error handling and logging

## 🛠️ Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0
- PostgreSQL database (local or cloud-based like Neon)
- Cloudinary account for file storage
- Clerk account for authentication
- Google Gemini API key
- Clipdrop API key

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables

4. **Run in development mode**
   ```bash
   npm run dev
   ```

5. **Run in production mode**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=your_neon_database_url_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# API Keys
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 📦 Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with hot-reload
- `npm test` - Run tests
- `npm run lint` - Lint the code
- `npm run format` - Format the code

## 🛡️ Security

- Rate limiting is enabled (100 requests per 15 minutes per IP)
- Helmet.js is used for securing HTTP headers
- CORS is configured to only allow requests from the frontend URL
- Environment variables are used for sensitive configuration

## 📝 API Documentation

### Health Check
- `GET /api/health` - Check if the server is running

### Authentication
All routes except the health check require authentication via Clerk.

### Error Responses

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error message"
}
```

## 🚀 Deployment

### Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` and follow the prompts
3. Set up environment variables in Vercel dashboard

### Heroku
1. Create a new Heroku app
2. Set up the database add-on
3. Set environment variables
4. Deploy using Git or Heroku CLI

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
