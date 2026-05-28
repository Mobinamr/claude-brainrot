const { exec } = require('child_process');
const { getConfig } = require('../config');

class VideoPopupManager {
  constructor() {
    this.active = false;
    this.currentVideoWindow = null;
    this.config = getConfig();
    this.videoUrls = [
      'https://www.tiktok.com/foryou',
      'https://www.youtube.com/shorts',
      'https://www.instagram.com/reels'
    ];
    this.currentIndex = 0;
  }

  async showVideo() {
    if (this.active) {
      console.log('Video already showing');
      return;
    }

    this.active = true;
    console.log('🎥 Opening video feed in browser');

    this.launchVideoPlayer();
  }

  hideVideo() {
    if (!this.active) {
      return;
    }

    this.active = false;
    console.log('🚫 Closing video browser');

    this.closeVideoPlayer();
  }

  getRandomVideoUrl() {
    // Rotate through platforms or pick random
    const url = this.videoUrls[this.currentIndex % this.videoUrls.length];
    this.currentIndex++;
    return url;
  }

  launchVideoPlayer() {
    const videoUrl = this.getRandomVideoUrl();
    console.log(`📺 Opening: ${videoUrl}`);

    // Open in default browser with AppleScript to control window size
    const script = `
      osascript -e 'tell application "Safari"
        activate
        make new document with properties {URL:"${videoUrl}"}
        set bounds of window 1 to {100, 100, 600, 900}
      end tell'
    `;

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.log('Safari not available, trying Chrome...');
        this.launchWithChrome(videoUrl);
      } else {
        this.currentVideoWindow = 'safari';
        console.log('✅ Video feed opened in Safari');
      }
    });
  }

  launchWithChrome(videoUrl) {
    const script = `
      osascript -e 'tell application "Google Chrome"
        activate
        make new window
        set URL of active tab of window 1 to "${videoUrl}"
      end tell'
    `;

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.log('Chrome not available, using default browser...');
        exec(`open "${videoUrl}"`, (err) => {
          if (!err) {
            this.currentVideoWindow = 'default';
            console.log('✅ Video feed opened in default browser');
          }
        });
      } else {
        this.currentVideoWindow = 'chrome';
        console.log('✅ Video feed opened in Chrome');
      }
    });
  }

  closeVideoPlayer() {
    if (!this.currentVideoWindow) {
      return;
    }

    console.log('🔒 Closing video window automatically...');

    // Close the most recent Safari/Chrome window
    if (this.currentVideoWindow === 'safari') {
      const closeScript = `
        osascript -e 'tell application "Safari"
          if (count of windows) > 0 then
            close window 1
          end if
        end tell'
      `;

      exec(closeScript, (error) => {
        if (error) {
          console.log('⚠️  Could not close Safari window automatically');
        } else {
          console.log('✅ Safari window closed');
        }
      });
    } else if (this.currentVideoWindow === 'chrome') {
      const closeScript = `
        osascript -e 'tell application "Google Chrome"
          if (count of windows) > 0 then
            close window 1
          end if
        end tell'
      `;

      exec(closeScript, (error) => {
        if (error) {
          console.log('⚠️  Could not close Chrome window automatically');
        } else {
          console.log('✅ Chrome window closed');
        }
      });
    }

    this.currentVideoWindow = null;
  }

  isActive() {
    return this.active;
  }
}

module.exports = { VideoPopupManager };
