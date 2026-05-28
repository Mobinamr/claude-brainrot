# Claude Brainrot 🧠

> Just type `claudetiktok` and watch TikTok while Claude works!

Watch TikTok automatically while working with Claude Code! Simple command, no servers, no localhost - just TikTok opening in your browser while Claude does its thing.

## How It Works

1. Install once → run `claudetiktok` anytime
2. TikTok opens in top-right corner
3. **Claude working** → TikTok visible (watch while Claude types!)
4. **Claude waiting for your response** → TikTok docks after 3s (focus on responding!)
5. **You send new message** → TikTok undocks (watch again!)

**No login, no servers, 100% automatic**

---

## Installation (3 Steps Only)

### Prerequisites
- ✅ **macOS** (uses AppleScript)
- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **Safari or Chrome**

Check Node.js:
```bash
node --version  # Should be v18.0.0+
```

---

### Step 1: Clone & Install
```bash
git clone https://github.com/Mobinamr/claude-brainrot.git
cd claude-brainrot
npm install
```

### Step 2: Link Command Globally
```bash
npm link
```

This makes `claudetiktok` available everywhere in your terminal!

### Step 3: Run It
```bash
claudetiktok
```

That's it! TikTok opens automatically.

---

## Usage

### In Your Claude Code Session:

Simply tell Claude:
```
I want TikTok while you work. Install from https://github.com/Mobinamr/claude-brainrot.git
and run 'claudetiktok' for me.
```

Or run it yourself before starting work:
```bash
claudetiktok
```

### What You'll See:

```
🧠 Claude Brainrot - Opening TikTok...

📺 Opening TikTok in top-right corner
✅ TikTok opened in Safari (top-right corner)
🎵 Enjoy watching while Claude works!

⚡ Monitoring your Claude session...
   • Claude working → TikTok visible (watch while Claude works!)
   • Claude waiting for you → TikTok docks (focus on responding)
   • You send message → TikTok undocks (watch again!)

Press Ctrl+C to stop
```

### Stop It:
Press `Ctrl+C` in the terminal

---

## How It Actually Works

- **No localhost or servers** - Direct browser command via AppleScript
- **No configuration** - Just works out of the box
- **Smart docking** - Minimizes after 3s idle, restores on new activity
- **Session persistence** - Same TikTok window throughout your work

---

## Troubleshooting

### Command not found: claudetiktok
Run `npm link` again in the claude-brainrot directory

### TikTok doesn't open
- Make sure Safari or Chrome is installed
- Check permissions: System Preferences → Security & Privacy → Automation

### Window opens off-screen
Edit window position in `bin/claudetiktok.js` line with `{900, 50, 1400, 850}`

## What Opens

- 🎵 TikTok For You page (no login needed!)
- Opens in Safari/Chrome in top-right area
- Docks automatically when waiting for your input
- Restores when you send new prompts

## Customization

Want different video site? Edit `src/video/videoPopup.js`:

```javascript
this.tiktokUrl = 'https://www.youtube.com/shorts'; // or any site!
```

## Requirements

- macOS (uses AppleScript for window control)
- Node.js 18+
- Safari or Chrome

## How It Works Technically

The app monitors HTTP activity from Claude Code:
- Detects when you send prompts → Shows TikTok
- After 3s idle → Docks TikTok to tray
- New prompt → Restores TikTok window
- Same session continues throughout!

## Privacy

- ✅ No data collection
- ✅ No tracking
- ✅ No external servers
- ✅ Everything runs locally
- ✅ No login/passwords needed

## Project Structure

```
claudepp/
├── src/
│   ├── index.js              # Main server (all-in-one)
│   ├── config.js             # Dynamic config
│   ├── monitor/
│   │   └── simpleMonitor.js  # Activity tracking
│   └── video/
│       └── videoPopup.js     # Browser opener
└── package.json
```

## Why "Claude Brainrot"?

Because watching TikTok while Claude works is peak productivity. 😎

## License

MIT - Do whatever you want with it

---

Made with Claude Code 🤖
