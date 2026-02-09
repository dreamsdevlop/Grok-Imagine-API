# 🚀 Quick Start Guide - Grok Imagine API

## ✅ You're Almost Ready!

All features are already integrated:
- ✅ **Image Generation** - Generate stunning images with Grok AI
- ✅ **AI Chat** - Conversational AI with Grok models
- ✅ **Video Generation** - Create AI-powered videos

## 🎯 Start in 3 Steps

### 1️⃣ Set Up Database

Make sure PostgreSQL is running, then push the database schema:

```powershell
npm run db:push
```

If you don't have PostgreSQL, you can quickly set it up:

```powershell
# Install PostgreSQL (if not installed)
# Download from: https://www.postgresql.org/download/windows/

# Create the database
psql -U postgres
CREATE DATABASE grok_imagine;
\q
```

### 2️⃣ Start the Development Server

```powershell
npm run dev
```

The server will start at **http://localhost:5000**

### 3️⃣ Open in Your Browser

Navigate to:
- **http://localhost:5000** - Home (Image Generator)
- **http://localhost:5000/chat** - AI Chat Interface
- **http://localhost:5000/video** - Video Generator
- **http://localhost:5000/history** - View all generations

## 🎨 What You Can Do

### Image Generation
1. Go to `/` (home page)
2. Enter a text prompt (e.g., "A futuristic city with flying cars")
3. Select a model and image count
4. Click "Generate"
5. Download or view your generated images

### AI Chat
1. Go to `/chat`
2. Click "New Chat" to create a conversation
3. Select a Grok model (grok-2 recommended)
4. Type your message and press Enter
5. Have a conversation with AI!

### Video Generation
1. Go to `/video`
2. Enter a prompt (e.g., "Waves crashing on a beach")
3. Set duration, width, and height
4. Select a model
5. Click "Generate Video"
6. Watch your AI-generated video!

## 🔧 Configuration

Your `.env` file is already configured with:
```
RAPIDAPI_KEY=76bfb7b74bmshd40ab0b8f00b2aep1da7dejsnd4379b952417
DATABASE_URL=postgres://localhost:5432/grok_imagine
PORT=5000
```

## 🧪 Test the API

Run the test script to verify all endpoints:

```powershell
node test-api.js
```

This will test:
- Health check
- Chat session creation and messaging
- Video generation
- Image generation

## 📱 Available Routes

### Frontend Pages
| Route | Description |
|-------|-------------|
| `/` | Image Generator (Home) |
| `/chat` | AI Chat Interface |
| `/video` | Video Generator |
| `/history` | View All Generations |
| `/history/:id` | View Specific Generation |

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/images` | List all images |
| POST | `/api/images` | Generate images |
| GET | `/api/chat` | List chat sessions |
| POST | `/api/chat` | Create chat session |
| POST | `/api/chat/:id/messages` | Send message |
| GET | `/api/videos` | List all videos |
| POST | `/api/videos` | Generate video |

## 🌟 Available AI Models

### Images
- `grok-imagine` (recommended)
- `flux-1.1-pro`
- `dall-e-3`

### Chat
- `grok-2` (recommended)
- `grok-beta`
- `grok-vision-beta`
- `gpt-4`
- `claude-sonnet`

### Videos
- `grok-video` (default)

## 🎯 Example Prompts

### For Images
- "A serene Japanese garden with cherry blossoms"
- "Cyberpunk city at night with neon lights"
- "Abstract geometric patterns in vibrant colors"
- "Photorealistic portrait of a futuristic robot"

### For Chat
- "Explain quantum computing in simple terms"
- "Write a short story about time travel"
- "What are the best practices for React development?"
- "Help me plan a trip to Japan"

### For Videos
- "Ocean waves crashing on a rocky shore"
- "Time-lapse of a sunset over mountains"
- "A butterfly landing on a flower"
- "Raindrops falling on a window"

## ⚠️ Troubleshooting

### Database Connection Issues
```powershell
# Check if PostgreSQL is running
pg_isready

# If not, start it:
# On Windows: Start from Services or pgAdmin
# Or manually: pg_ctl start -D "C:\Program Files\PostgreSQL\15\data"
```

### Port Already in Use
If port 5000 is taken, change it in `.env`:
```env
PORT=3000
```

### RapidAPI Errors
- Check your API key is correct in `.env`
- Verify you have credits/quota on RapidAPI
- Check your internet connection

### Module Not Found
```powershell
# Reinstall dependencies
npm install
```

## 📚 Need Help?

1. Check the main **README.md** for detailed documentation
2. Run the test script: `node test-api.js`
3. Check server logs in the terminal
4. Open browser DevTools to see frontend errors

## 🎉 You're Ready!

Everything is set up. Just run:

```powershell
npm run db:push
npm run dev
```

Then open **http://localhost:5000** and start creating with AI! 🚀
