# 🚀 Grok Imagine API - Complete AI Platform

A full-featured web application integrating **xAI's Grok models** through RapidAPI for image generation, AI chat conversations, and video generation.

## ✨ Features

### 🎨 Image Generation
- Generate images using Grok's AI image models
- Multiple image sizes and styles
- Generate multiple images at once
- Gallery view of all generated images
- Download generated images

### 💬 AI Chat
- Real-time conversations with Grok AI models
- Session management (create, save, resume conversations)
- Full chat history
- Support for multiple AI models (grok-2, grok-beta, etc.)
- Context-aware responses

### 🎥 Video Generation
- AI-powered video generation from text prompts
- Customizable duration, width, and height
- Video preview and thumbnail support
- Status tracking (pending, processing, completed, failed)
- Gallery of generated videos

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web server
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Database management
- **PostgreSQL** - Database
- **RapidAPI** - xAI/Grok API integration

### Frontend
- **React** - UI framework
- **Wouter** - Routing
- **TanStack Query** - Data fetching and caching
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **RapidAPI Account** with access to [xAI All Models API](https://rapidapi.com/xai-all-models)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd "d:\\grok imagine api\\Grok-Imagine-API"
npm install
```

### 2. Configure Environment

The `.env` file is already created with your RapidAPI key. Verify the configuration:

```env
RAPIDAPI_KEY=76bfb7b74bmshd40ab0b8f00b2aep1da7dejsnd4379b952417
DATABASE_URL=postgres://localhost:5432/grok_imagine
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 3. Set Up Database

```bash
# Push database schema
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 5. Test API Endpoints

```bash
node test-api.js
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### Image Generation

**List all images**
```http
GET /api/images
```

**Get specific image**
```http
GET /api/images/:id
```

**Generate new images**
```http
POST /api/images
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "model": "grok-imagine",
  "n": 1,
  "size": "1024x1024"
}
```

### Chat/Conversation

**List all chat sessions**
```http
GET /api/chat
```

**Get specific chat session**
```http
GET /api/chat/:id
```

**Create new chat session**
```http
POST /api/chat
Content-Type: application/json

{
  "title": "My Conversation",
  "model": "grok-2"
}
```

**List messages in a chat**
```http
GET /api/chat/:id/messages
```

**Send message to chat**
```http
POST /api/chat/:id/messages
Content-Type: application/json

{
  "content": "Hello, Grok!",
  "model": "grok-2"
}
```

### Video Generation

**List all videos**
```http
GET /api/videos
```

**Get specific video**
```http
GET /api/videos/:id
```

**Generate new video**
```http
POST /api/videos
Content-Type: application/json

{
  "prompt": "A serene beach with waves",
  "model": "grok-video",
  "duration": 5,
  "width": 1024,
  "height": 576
}
```

## 🎯 Available AI Models

### Image Models
- `grok-imagine` - Default image generation model
- `flux-1.1-pro` - High-quality image generation
- `dall-e-3` - OpenAI's DALL-E 3 (if available via RapidAPI)

### Chat Models
- `grok-2` - Latest Grok conversation model
- `grok-beta` - Beta version with newest features
- `grok-2-mini` - Faster, lightweight version

### Video Models
- `grok-video` - AI video generation
- Custom models as supported by RapidAPI

## 📁 Project Structure

```
Grok-Imagine-API/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Application pages
│   │   └── lib/          # Utility functions
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route handlers
│   └── storage.ts        # Database operations
├── shared/                # Shared types and schemas
│   ├── routes.ts         # API route definitions
│   └── schema.ts         # Database schema
├── .env                  # Environment variables
├── package.json          # Dependencies
└── test-api.js          # API testing script
```

## 🔧 Development

### Type Checking
```bash
npm run check
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 🌟 Usage Examples

### Generate an Image
```javascript
const response = await fetch('http://localhost:5000/api/images', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A cyberpunk cityscape at night',
    model: 'grok-imagine',
    n: 2,
    size: '1024x1024'
  })
});

const result = await response.json();
console.log(result);
```

### Start a Chat Conversation
```javascript
// Create session
const session = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Philosophy Discussion',
    model: 'grok-2'
  })
}).then(r => r.json());

// Send message
const message = await fetch(`http://localhost:5000/api/chat/${session.id}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'What is the meaning of life?',
    model: 'grok-2'
  })
}).then(r => r.json());

console.log(message.assistantMessage.content);
```

### Generate a Video
```javascript
const video = await fetch('http://localhost:5000/api/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A cat playing with a ball of yarn',
    model: 'grok-video',
    duration: 5,
    width: 1024,
    height: 576
  })
}).then(r => r.json());

console.log('Video URL:', video.videoUrl);
console.log('Thumbnail:', video.thumbnailUrl);
```

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Keep your `RAPIDAPI_KEY` secret
- Change the `SESSION_SECRET` in production
- Use HTTPS in production environments
- Implement rate limiting for public deployments

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RAPIDAPI_KEY` | Your RapidAPI key for xAI models | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Create database if it doesn't exist
createdb grok_imagine
```

### RapidAPI Errors
- Verify your API key is correct
- Check your RapidAPI subscription status
- Ensure you have credits/quota remaining

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License - Feel free to use this project as you wish

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
1. Check the [RapidAPI xAI documentation](https://rapidapi.com/xai-all-models)
2. Review the `test-api.js` file for usage examples
3. Check the browser console for frontend errors
4. Review server logs for backend errors

---

**Built with ❤️ using Grok AI by xAI through RapidAPI**
