#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const path = require('path');
const { getConfig } = require('./config');
const { startSimpleMonitor, recordActivity } = require('./monitor/simpleMonitor');
const { VideoPopupManager } = require('./video/videoPopup');

const app = express();
const config = getConfig();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Activity tracking middleware
app.use((req, res, next) => {
  recordActivity();
  next();
});

// Video popup manager
const videoManager = new VideoPopupManager();

// Simple homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Claude Brainrot</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0a0a;
          color: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          text-align: center;
        }
        h1 { font-size: 48px; margin-bottom: 20px; }
        p { color: #999; margin-bottom: 30px; line-height: 1.6; }
        .status {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 20px;
        }
        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          margin-right: 10px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        button {
          background: #fff;
          color: #0a0a0a;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin: 5px;
        }
        button:hover { background: #e5e5e5; }
        .info {
          background: #1a1208;
          border: 1px solid #332610;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          text-align: left;
        }
        .info h3 { color: #fbbf24; margin-bottom: 10px; }
        .info p { color: #d4a574; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🧠 Claude Brainrot</h1>
        <p>Automatic TikTok while you work with Claude Code</p>

        <div class="status">
          <div><span class="status-dot"></span> System Active</div>
          <p style="margin-top: 15px; color: #666;">TikTok will open in top-right corner when activity is detected</p>
        </div>

        <button onclick="testVideo()">🎥 Test TikTok Popup</button>
        <button onclick="window.location.reload()">🔄 Refresh</button>

        <div class="info">
          <h3>How it works:</h3>
          <p>• When you interact with this page → TikTok opens in top-right</p>
          <p>• Watch while Claude processes your prompts</p>
          <p>• When Claude needs authorization → TikTok minimizes to dock</p>
          <p>• When you resume → TikTok restores automatically</p>
        </div>
      </div>

      <script>
        async function testVideo() {
          const res = await fetch('/api/video/show', { method: 'POST' });
          const data = await res.json();
          alert(data.message || 'Video opening...');
        }

        // Auto refresh every 5 seconds to trigger activity
        // setTimeout(() => location.reload(), 5000);
      </script>
    </body>
    </html>
  `);
});

// API endpoints
app.post('/api/video/show', (req, res) => {
  videoManager.showVideo();
  res.json({ success: true, message: 'Opening video feed in browser...' });
});

app.post('/api/video/hide', (req, res) => {
  videoManager.hideVideo();
  res.json({ success: true, message: 'Video closed' });
});

// Start simple activity monitor
startSimpleMonitor({
  onActive: () => {
    console.log('💫 Activity detected - showing TikTok');
    videoManager.showVideo();
  },
  onIdle: () => {
    console.log('⏸️  Waiting for authorization - minimizing TikTok');
    videoManager.hideVideo(); // This now minimizes instead of closes
  }
});

app.listen(config.port, () => {
  console.log(`\n🧠 Claude Brainrot - Running!`);
  console.log(`🚀 Open: ${config.baseUrl}`);
  console.log(`📺 Videos will open automatically when you interact`);
  console.log(`👤 User: ${config.username}\n`);
});
