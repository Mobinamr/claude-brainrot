const { exec } = require('child_process');
const { getConfig } = require('../config');

class VideoPopupManager {
  constructor() {
    this.active = false;
    this.currentVideoWindow = null;
    this.config = getConfig();
    this.tiktokUrl = 'https://www.tiktok.com/foryou';
    this.minimized = false;
  }

  async showVideo() {
    if (this.active && !this.minimized) {
      console.log('TikTok already showing');
      return;
    }

    // If minimized, restore it
    if (this.minimized) {
      this.restoreVideo();
      return;
    }

    this.active = true;
    console.log('🎥 Opening TikTok in browser');

    this.launchVideoPlayer();
  }

  hideVideo() {
    // Don't hide, just minimize for authorization prompts
    this.minimizeVideo();
  }

  minimizeVideo() {
    if (!this.active || this.minimized) {
      return;
    }

    this.minimized = true;
    console.log('📉 Minimizing TikTok for user authorization');

    this.minimizeVideoPlayer();
  }

  restoreVideo() {
    if (!this.minimized) {
      return;
    }

    this.minimized = false;
    console.log('📈 Restoring TikTok window');

    this.restoreVideoPlayer();
  }

  launchVideoPlayer() {
    console.log(`📺 Opening TikTok in top-right corner`);

    // Position in top-right corner: x from right edge, y at top
    // Screen width typically ~1920, so start at x=1320 for 600px wide window
    const script = `
      osascript -e 'tell application "Safari"
        activate
        make new document with properties {URL:"${this.tiktokUrl}"}
        set bounds of window 1 to {1320, 0, 1920, 800}
      end tell'
    `;

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.log('Safari not available, trying Chrome...');
        this.launchWithChrome(this.tiktokUrl);
      } else {
        this.currentVideoWindow = 'safari';
        console.log('✅ TikTok opened in Safari (top-right)');
      }
    });
  }

  launchWithChrome(videoUrl) {
    const script = `
      osascript -e 'tell application "Google Chrome"
        activate
        make new window
        set URL of active tab of window 1 to "${videoUrl}"
        set bounds of front window to {1320, 0, 1920, 800}
      end tell'
    `;

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.log('Chrome not available, using default browser...');
        exec(`open "${videoUrl}"`, (err) => {
          if (!err) {
            this.currentVideoWindow = 'default';
            console.log('✅ TikTok opened in default browser');
          }
        });
      } else {
        this.currentVideoWindow = 'chrome';
        console.log('✅ TikTok opened in Chrome (top-right)');
      }
    });
  }

  minimizeVideoPlayer() {
    if (!this.currentVideoWindow) {
      return;
    }

    console.log('📉 Minimizing TikTok window to dock...');

    // Minimize to dock using native AppleScript
    if (this.currentVideoWindow === 'safari') {
      const minimizeScript = `
        osascript -e 'tell application "Safari"
          set miniaturized of window 1 to true
        end tell'
      `;

      exec(minimizeScript, (error) => {
        if (error) {
          console.log('⚠️  Could not minimize Safari window');
        } else {
          console.log('✅ Safari minimized to dock');
        }
      });
    } else if (this.currentVideoWindow === 'chrome') {
      const minimizeScript = `
        osascript -e 'tell application "System Events"
          tell process "Google Chrome"
            set value of attribute "AXMinimized" of window 1 to true
          end tell
        end tell'
      `;

      exec(minimizeScript, (error) => {
        if (error) {
          console.log('⚠️  Could not minimize Chrome window');
        } else {
          console.log('✅ Chrome minimized to dock');
        }
      });
    }
  }

  restoreVideoPlayer() {
    if (!this.currentVideoWindow) {
      return;
    }

    console.log('📈 Restoring TikTok window from dock...');

    // Restore from dock using native AppleScript
    if (this.currentVideoWindow === 'safari') {
      const restoreScript = `
        osascript -e 'tell application "Safari"
          set miniaturized of window 1 to false
          activate
        end tell'
      `;

      exec(restoreScript, (error) => {
        if (error) {
          console.log('⚠️  Could not restore Safari window');
        } else {
          console.log('✅ Safari restored from dock');
        }
      });
    } else if (this.currentVideoWindow === 'chrome') {
      const restoreScript = `
        osascript -e 'tell application "System Events"
          tell process "Google Chrome"
            set value of attribute "AXMinimized" of window 1 to false
          end tell
        end tell
        tell application "Google Chrome" to activate'
      `;

      exec(restoreScript, (error) => {
        if (error) {
          console.log('⚠️  Could not restore Chrome window');
        } else {
          console.log('✅ Chrome restored from dock');
        }
      });
    }
  }

  isActive() {
    return this.active;
  }
}

module.exports = { VideoPopupManager };
