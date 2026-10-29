/**
 * ============================================================================
 * CONFIG.JS — Social Media Redirection & Status Manager
 * 
 * INSTRUCTIONS FOR ANABRATA:
 *  - Set status to 1: Link is ACTIVE (opens the application or website directly).
 *  - Set status to 0: Link is INACTIVE (shows the animated "no-info.html" page).
 * 
 * To activate Facebook or YouTube in the future:
 *  1. Change status from 0 to 1
 *  2. Replace the URL with your profile / channel link!
 * ============================================================================
 */

window.SOCIAL_CONFIG = {
  // 1. FACEBOOK: Set to 0 (Inactive) for now
  facebook: {
    status: 0,
    url: "https://facebook.com/your-username",
    name: "Facebook",
    icon: "fa-brands fa-facebook-f",
    color: "#1877F2"
  },

  // 2. INSTAGRAM: Set to 1 (Active)
  instagram: {
    status: 1,
    url: "https://www.instagram.com/abheroism?srtk=MndnNzF6a2oyb3pu",
    name: "Instagram",
    icon: "fa-brands fa-instagram",
    color: "#E1306C"
  },

  // 3. YOUTUBE: Set to 0 (Inactive) for now
  youtube: {
    status: 0,
    url: "https://youtube.com/@your-channel",
    name: "YouTube",
    icon: "fa-brands fa-youtube",
    color: "#FF0000"
  },

  // 4. WHATSAPP: Set to 1 (Active with phone: 9679010859)
  whatsapp: {
    status: 1,
    phone: "9679010859",
    url: "https://wa.me/919679010859?text=Hi%20Anabrata!%20Connecting%20from%20your%20website",
    name: "WhatsApp",
    icon: "fa-brands fa-whatsapp",
    color: "#25D366"
  },

  // 5. GOOGLE MAPS: Set to 1 (Active with verified location)
  maps: {
    status: 1,
    url: "https://maps.app.goo.gl/tvgFF9HiQKRyVHHu5",
    name: "Google Maps",
    icon: "fa-solid fa-location-dot",
    color: "#EA4335"
  },

  // 6. EMAIL: Set to 1 (Active -> opens directly in Gmail on PC, or Mail app on Mobile)
  email: {
    status: 1,
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=anabratabis@gmail.com",
    name: "Email",
    icon: "fa-solid fa-envelope",
    color: "#2563EB"
  }
};

/**
 * Dedicated Email Dispatcher:
 * - On PC: Opens Gmail directly in a new tab with compose window to anabratabis@gmail.com
 * - On Mobile: Triggers native mailto: so it opens the user's Gmail app directly!
 */
window.handleEmailClick = function (event) {
  if (event) event.preventDefault();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = 'mailto:anabratabis@gmail.com';
  } else {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=anabratabis@gmail.com', '_blank');
  }
};

/**
 * Global Handler for Clickable Social Actions:
 * Checks if platform status is 1 or 0 and directs accordingly.
 */
window.handleSocialClick = function (platformKey, event) {
  if (platformKey === 'email') {
    window.handleEmailClick(event);
    return;
  }

  const item = window.SOCIAL_CONFIG[platformKey];
  if (!item) return;

  if (item.status === 1) {
    // ACTIVE: Direct to app / web application
    if (event) event.preventDefault();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // On mobile, direct window.location allows OS to trigger native apps (Maps, WhatsApp, Instagram)
      window.location.href = item.url;
    } else {
      // On desktop PC, open in a new tab
      window.open(item.url, '_blank');
    }
  } else {
    // INACTIVE (0): Redirect to dedicated animated "no-info.html"
    if (event) event.preventDefault();
    window.location.href = `no-info.html?platform=${encodeURIComponent(platformKey)}`;
  }
};
