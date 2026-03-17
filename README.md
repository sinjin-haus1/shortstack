# ShortStack - AI Short Video Repurposer

Turn ONE long video into 10+ platform-optimized short clips for TikTok, Reels, and YouTube Shorts with different hooks, captions, and aspect ratios.

## Features

✅ **Video Upload** - Drag & drop interface for easy video upload  
✅ **AI Clip Generation** - Automatically generates multiple clips with engaging hooks  
✅ **Caption Generation** - AI-powered caption generation for each clip  
✅ **Aspect Ratio Conversion** - Convert between 9:16, 16:9, and 1:1  
✅ **Bulk Export** - Download all clips as a ZIP file  

## Tech Stack

- **Backend**: NestJS + MongoDB + GraphQL
- **Frontend**: Next.js 14 + Material UI + TypeScript

## Getting Started

```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Start development servers
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/graphql

## Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/shortstack
```

## License

MIT
