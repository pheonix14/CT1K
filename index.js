require('dotenv').config();
const { createCanvas } = require('canvas');
const ffmpeg = require('fluent-ffmpeg');
const { getSubscriberCount } = require('./utils/api');
const { PassThrough } = require('stream');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;
const YOUTUBE_STREAM_KEY = process.env.YOUTUBE_STREAM_KEY;
const REFRESH_RATE_MS = parseInt(process.env.REFRESH_RATE_MS || '30000', 10);
const GOAL = 1000;

const isLocal = process.argv.includes('--local');

if (!isLocal && (!YOUTUBE_API_KEY || !CHANNEL_ID || !YOUTUBE_STREAM_KEY)) {
    console.error("Missing required environment variables. Check .env file.");
    process.exit(1);
}

// Stream configuration
const width = 1280;
const height = 720;
const fps = 30;

// Create a pass-through stream to act as the video source
const videoStream = new PassThrough();

// Setup canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

let currentSubCount = 0;

async function updateData() {
    // In local test without API key, just simulate it
    if (isLocal && (!YOUTUBE_API_KEY || !CHANNEL_ID)) {
        currentSubCount += Math.floor(Math.random() * 5);
        if (currentSubCount > GOAL) currentSubCount = GOAL;
    } else {
        const count = await getSubscriberCount(CHANNEL_ID, YOUTUBE_API_KEY);
        if (count !== null) {
            currentSubCount = count;
        }
    }
}

function drawFrame() {
    // Background
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#cba6f7';
    ctx.font = 'bold 60px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROAD TO 1000 SUBSCRIBERS', width / 2, 200);

    // Sub Count
    ctx.fillStyle = '#a6e3a1';
    ctx.font = 'bold 150px sans-serif';
    ctx.fillText(currentSubCount.toString(), width / 2, height / 2 + 50);

    // Goal text
    ctx.fillStyle = '#f38ba8';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`GOAL: ${GOAL}`, width / 2, height / 2 + 150);
    
    // Branding
    ctx.fillStyle = '#89b4fa';
    ctx.font = '30px sans-serif';
    ctx.fillText('Developed by Pheonix 14 - CT1K', width / 2, height - 50);

    // Write frame to stream
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
    videoStream.write(buffer);
}

async function startStream() {
    console.log("Starting stream generation...");
    await updateData();
    
    // Start data update loop
    setInterval(updateData, REFRESH_RATE_MS);

    // Start frame generation loop
    const frameIntervalMs = 1000 / fps;
    setInterval(drawFrame, frameIntervalMs);

    // Configure ffmpeg
    const command = ffmpeg()
        .input(videoStream)
        .inputFormat('image2pipe')
        .inputOptions([
            '-framerate', `${fps}`,
            '-vcodec', 'mjpeg'
        ])
        .outputOptions([
            '-vcodec libx264',
            '-preset veryfast',
            '-b:v 3000k',
            '-maxrate 3000k',
            '-bufsize 6000k',
            '-pix_fmt yuv420p',
            '-g', `${fps * 2}`
        ]);

    if (isLocal) {
        console.log("Running in local mode. Outputting to output.mp4");
        // Record 10 seconds locally to test
        command.outputOptions(['-t 10']);
        command.save('output.mp4');
    } else {
        const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${YOUTUBE_STREAM_KEY}`;
        console.log("Starting RTMP stream to YouTube...");
        command.outputOptions(['-f flv']);
        command.save(rtmpUrl);
    }

    command.on('start', (commandLine) => {
        console.log('FFmpeg spawned with command: ' + commandLine);
    })
    .on('error', (err, stdout, stderr) => {
        console.error('Error in FFmpeg:', err.message);
        console.error('FFmpeg stderr:', stderr);
        process.exit(1);
    })
    .on('end', () => {
        console.log('FFmpeg processing ended.');
        process.exit(0);
    });
}

startStream();
