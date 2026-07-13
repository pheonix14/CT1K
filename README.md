# CT1K - YouTube Live Subscriber Counter

![CT1K](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Developed By](https://img.shields.io/badge/Developed%20By-Pheonix%2014-blue.svg)

CT1K is a lightweight, fully open-source tool developed by **Pheonix 14** that generates a continuous 24/7 YouTube live stream. It dynamically draws a sleek UI and fetches a YouTube channel's live subscriber count, broadcasting it directly to YouTube in real-time.

## Features
- **Real-Time Sub Count**: Fetches accurate counts via the YouTube Data API v3.
- **Dynamic Rendering**: Generates a 30fps stream using Node-canvas without needing static image backgrounds.
- **Render Ready**: Includes a `Dockerfile` and `render.yaml` for instant deployment on [Render](https://render.com).
- **Local Testing**: Built-in script to preview the stream generation locally before going live.

## Prerequisites
- Node.js (v16+)
- FFmpeg installed locally (for local testing)
- A YouTube Data API Key
- A YouTube Live Stream Key

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ct1k.git
   cd ct1k
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your details:
   ```env
   YOUTUBE_API_KEY=your_youtube_data_api_key
   CHANNEL_ID=your_youtube_channel_id
   YOUTUBE_STREAM_KEY=your_rtmp_stream_key
   REFRESH_RATE_MS=30000
   ```

4. **Test Locally:**
   To test the generation without broadcasting to YouTube, run:
   ```bash
   npm run start:local
   ```
   This will generate a 10-second `output.mp4` file in the directory.

## Deployment (Render)

1. Create a new **Background Worker** on Render.
2. Connect your GitHub repository.
3. Render will automatically detect the `Dockerfile` or `render.yaml`.
4. Make sure to add your environment variables (`YOUTUBE_API_KEY`, `CHANNEL_ID`, `YOUTUBE_STREAM_KEY`) in the Render dashboard.

## Credits
Developed with ❤️ by **Pheonix 14**. Fully open source and free to use.

## License
MIT License
