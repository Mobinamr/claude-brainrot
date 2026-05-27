// Simple real-time activity monitor
// Triggers video popup when there's activity in the session

class SimpleActivityMonitor {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.isActive = false;
    this.lastActivityTime = Date.now();
    this.activityTimeout = null;
    this.checkInterval = null;
  }

  start() {
    console.log('🔍 Starting simple activity monitor');

    // Check activity every 1 second
    this.checkInterval = setInterval(() => {
      this.checkActivity();
    }, 1000);

    console.log('✅ Simple activity monitor started');
  }

  checkActivity() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivityTime;

    // If no activity for 10 seconds, mark as idle
    if (timeSinceLastActivity > 10000) {
      if (this.isActive) {
        this.setIdle();
      }
    }
  }

  // Call this whenever there's activity (API calls, etc.)
  recordActivity() {
    this.lastActivityTime = Date.now();

    if (!this.isActive) {
      this.setActive();
    }

    // Reset the activity timeout
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }

    // Auto-idle after 10 seconds of no activity
    this.activityTimeout = setTimeout(() => {
      this.setIdle();
    }, 10000);
  }

  setActive() {
    this.isActive = true;
    console.log('🟢 Activity detected - setting active');
    this.callbacks.onActive?.();
  }

  setIdle() {
    this.isActive = false;
    console.log('🔴 No activity - setting idle');
    this.callbacks.onIdle?.();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    console.log('🛑 Simple activity monitor stopped');
  }
}

let monitorInstance = null;

function startSimpleMonitor(callbacks) {
  if (monitorInstance) {
    monitorInstance.stop();
  }
  monitorInstance = new SimpleActivityMonitor(callbacks);
  monitorInstance.start();
  return monitorInstance;
}

function stopSimpleMonitor() {
  if (monitorInstance) {
    monitorInstance.stop();
    monitorInstance = null;
  }
}

function recordActivity() {
  if (monitorInstance) {
    monitorInstance.recordActivity();
  }
}

module.exports = {
  SimpleActivityMonitor,
  startSimpleMonitor,
  stopSimpleMonitor,
  recordActivity
};
