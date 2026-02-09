# 📡 API Documentation - Grok Imagine API

Complete API reference for all endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required for local development. The RapidAPI key is configured server-side in the `.env` file.

---

## 🏥 Health Check

### GET `/health`
Check if the API is running.

**Response**
```json
{
  "ok": true
}
```

---

## 🎨 Image Generation

### GET `/images`
List all generated images.

**Response**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "prompt": "A beautiful sunset",
    "model": "grok-imagine",
    "n": 2,
    "size": "1024x1024",
    "images": [
      {
        "mimeType": "image/png",
        "dataBase64": "iVBORw0KG..."
      }
    ],
    "error": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET `/images/:id`
Get a specific image generation by ID.

**Parameters**
- `id` (string, path) - Image generation ID

**Response**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "prompt": "A beautiful sunset",
  "model": "grok-imagine",
  "n": 2,
  "size": "1024x1024",
  "images": [...],
  "error": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404)**
```json
{
  "message": "Not found"
}
```

### POST `/images`
Generate new images from a text prompt.

**Request Body**
```json
{
  "prompt": "A cyberpunk cityscape at night",
  "model": "grok-imagine",
  "n": 2,
  "size": "1024x1024"
}
```

**Parameters**
- `prompt` (string, required) - Text description of the image to generate
- `model` (string, required) - AI model to use
  - Options: `grok-imagine`, `flux-1.1-pro`, `dall-e-3`
- `n` (number, required) - Number of images to generate (1-4)
- `size` (string, required) - Image dimensions
  - Options: `256x256`, `512x512`, `1024x1024`, `1792x1024`, `1024x1792`

**Response (201)**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "prompt": "A cyberpunk cityscape at night",
  "model": "grok-imagine",
  "n": 2,
  "size": "1024x1024",
  "images": [
    {
      "mimeType": "image/png",
      "dataBase64": "iVBORw0KG..."
    },
    {
      "mimeType": "image/png",
      "dataBase64": "iVBORw0KG..."
    }
  ],
  "error": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400)**
```json
{
  "message": "Invalid prompt",
  "field": "prompt"
}
```

---

## 💬 Chat / Conversations

### GET `/chat`
List all chat sessions.

**Response**
```json
[
  {
    "id": "abc123",
    "title": "Philosophy Discussion",
    "model": "grok-2",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET `/chat/:id`
Get a specific chat session with all messages.

**Parameters**
- `id` (string, path) - Chat session ID

**Response**
```json
{
  "id": "abc123",
  "title": "Philosophy Discussion",
  "model": "grok-2",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "messages": [
    {
      "id": "msg1",
      "sessionId": "abc123",
      "role": "user",
      "content": "What is the meaning of life?",
      "model": "grok-2",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "msg2",
      "sessionId": "abc123",
      "role": "assistant",
      "content": "The meaning of life is a philosophical question...",
      "model": "grok-2",
      "createdAt": "2024-01-15T10:00:05.000Z"
    }
  ]
}
```

**Error Response (404)**
```json
{
  "message": "Not found"
}
```

### POST `/chat`
Create a new chat session.

**Request Body**
```json
{
  "title": "My Conversation",
  "model": "grok-2"
}
```

**Parameters**
- `title` (string, required) - Title for the chat session
- `model` (string, required) - AI model to use
  - Options: `grok-2`, `grok-beta`, `grok-vision-beta`, `gpt-4`, `claude-sonnet`

**Response (201)**
```json
{
  "id": "abc123",
  "title": "My Conversation",
  "model": "grok-2",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### GET `/chat/:id/messages`
List all messages in a chat session.

**Parameters**
- `id` (string, path) - Chat session ID

**Response**
```json
[
  {
    "id": "msg1",
    "sessionId": "abc123",
    "role": "user",
    "content": "Hello!",
    "model": "grok-2",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "id": "msg2",
    "sessionId": "abc123",
    "role": "assistant",
    "content": "Hi! How can I help you today?",
    "model": "grok-2",
    "createdAt": "2024-01-15T10:00:01.000Z"
  }
]
```

### POST `/chat/:id/messages`
Send a message in a chat session and get AI response.

**Parameters**
- `id` (string, path) - Chat session ID

**Request Body**
```json
{
  "content": "What is quantum computing?",
  "model": "grok-2"
}
```

**Parameters**
- `content` (string, required) - Message content/question
- `model` (string, required) - AI model to use for the response

**Response (201)**
```json
{
  "userMessage": {
    "id": "msg3",
    "sessionId": "abc123",
    "role": "user",
    "content": "What is quantum computing?",
    "model": "grok-2",
    "createdAt": "2024-01-15T10:05:00.000Z"
  },
  "assistantMessage": {
    "id": "msg4",
    "sessionId": "abc123",
    "role": "assistant",
    "content": "Quantum computing is a type of computing...",
    "model": "grok-2",
    "createdAt": "2024-01-15T10:05:03.000Z"
  },
  "error": null
}
```

---

## 🎥 Video Generation

### GET `/videos`
List all generated videos.

**Response**
```json
[
  {
    "id": "video123",
    "prompt": "Ocean waves at sunset",
    "model": "grok-video",
    "duration": 5,
    "width": 1024,
    "height": 576,
    "videoUrl": "https://example.com/video.mp4",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "status": "completed",
    "error": null,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

### GET `/videos/:id`
Get a specific video generation by ID.

**Parameters**
- `id` (string, path) - Video generation ID

**Response**
```json
{
  "id": "video123",
  "prompt": "Ocean waves at sunset",
  "model": "grok-video",
  "duration": 5,
  "width": 1024,
  "height": 576,
  "videoUrl": "https://example.com/video.mp4",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "status": "completed",
  "error": null,
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Response (404)**
```json
{
  "message": "Not found"
}
```

### POST `/videos`
Generate a new video from a text prompt.

**Request Body**
```json
{
  "prompt": "A serene beach with waves",
  "model": "grok-video",
  "duration": 5,
  "width": 1024,
  "height": 576
}
```

**Parameters**
- `prompt` (string, required) - Text description of the video to generate
- `model` (string, required) - AI model to use (e.g., `grok-video`)
- `duration` (number, required) - Video duration in seconds (1-10)
- `width` (number, required) - Video width in pixels
  - Options: 512, 768, 1024, 1280, 1920
- `height` (number, required) - Video height in pixels
  - Options: 288, 432, 576, 720, 1080

**Response (201)**
```json
{
  "id": "video123",
  "prompt": "A serene beach with waves",
  "model": "grok-video",
  "duration": 5,
  "width": 1024,
  "height": 576,
  "videoUrl": "https://api-url.s3.amazonaws.com/generated-video.mp4",
  "thumbnailUrl": "https://api-url.s3.amazonaws.com/thumbnail.jpg",
  "status": "completed",
  "error": null,
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

**Status Values**
- `pending` - Video generation is queued
- `processing` - Video is being generated
- `completed` - Video is ready
- `failed` - Generation failed (check `error` field)

**Error Response (400)**
```json
{
  "message": "Duration must be between 1 and 10 seconds",
  "field": "duration"
}
```

---

## 🔧 Error Handling

All endpoints follow a consistent error format:

**Validation Error (400)**
```json
{
  "message": "Invalid input",
  "field": "prompt"
}
```

**Not Found (404)**
```json
{
  "message": "Not found"
}
```

**Server Error (500)**
```json
{
  "message": "Internal server error"
}
```

---

## 📝 Rate Limiting

Currently, there are no rate limits for local development. However, RapidAPI enforces their own limits based on your subscription tier. Check your RapidAPI dashboard for quota information.

---

## 🎯 Example Usage

### JavaScript/Fetch

**Generate an Image**
```javascript
const response = await fetch('http://localhost:5000/api/images', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A futuristic robot',
    model: 'grok-imagine',
    n: 1,
    size: '1024x1024'
  })
});

const result = await response.json();
console.log(result);
```

**Start a Chat**
```javascript
// Create session
const session = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Tech Discussion',
    model: 'grok-2'
  })
}).then(r => r.json());

// Send message
const response = await fetch(`http://localhost:5000/api/chat/${session.id}/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'Explain AI in simple terms',
    model: 'grok-2'
  })
}).then(r => r.json());

console.log(response.assistantMessage.content);
```

**Generate a Video**
```javascript
const video = await fetch('http://localhost:5000/api/videos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Sunset over mountains',
    model: 'grok-video',
    duration: 5,
    width: 1024,
    height: 576
  })
}).then(r => r.json());

console.log('Video URL:', video.videoUrl);
```

### cURL

**Generate an Image**
```bash
curl -X POST http://localhost:5000/api/images \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful landscape",
    "model": "grok-imagine",
    "n": 1,
    "size": "1024x1024"
  }'
```

**Send Chat Message**
```bash
# First, create a session and note the ID
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Chat",
    "model": "grok-2"
  }'

# Then send a message (replace SESSION_ID)
curl -X POST http://localhost:5000/api/chat/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello!",
    "model": "grok-2"
  }'
```

---

## 🌐 CORS

CORS is enabled for all origins in development mode. For production, you should configure specific allowed origins in the server configuration.

---

## 📚 Additional Resources

- [RapidAPI xAI Documentation](https://rapidapi.com/xai-all-models)
- [Project README](README.md)
- [Quick Start Guide](QUICKSTART.md)

---

**Built with ❤️ using Grok AI by xAI through RapidAPI**
