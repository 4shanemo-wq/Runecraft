window.RuneCraftUtils = {
  getTikTokHandle(url) {
    if (!url) return null;
    const match = url.match(/tiktok\.com\/@([^/?&]+)/i);
    return match ? match[1] : null;
  },

  setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
    return el;
  }
};
