/**
 * ============================================================================
 * CLOCK.JS — Real-time Indian Standard Time (IST) Clock for Bongaon, West Bengal
 * ============================================================================
 */

(function () {
  function updateClock() {
    const clockElements = document.querySelectorAll('.live-clock-display, #liveClock, #liveClockMobile');
    if (!clockElements || clockElements.length === 0) return;

    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const timeStr = new Intl.DateTimeFormat('en-IN', options).format(now);
    clockElements.forEach(el => {
      el.textContent = timeStr;
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
})();
