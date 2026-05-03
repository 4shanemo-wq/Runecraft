window.RuneCraftLiveStatus = (() => {
  const backendBaseUrl = window.RUNECRAFT_SITE?.config?.backendBaseUrl || "";

  async function fetchAllLiveStatuses(handles) {
    if (!backendBaseUrl || !handles.length) return {};

    const params = new URLSearchParams();
    handles.forEach((handle) => params.append("user", handle));

    try {
      const response = await fetch(`${backendBaseUrl}/api/tiktok-live-status?${params.toString()}`);
      if (!response.ok) return {};

      const data = await response.json();
      if (!data.results) return {};

      return data.results.reduce((acc, item) => {
        if (item && item.user) {
          acc[item.user.toLowerCase()] = item.live === true;
        }
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching live statuses:", error);
      return {};
    }
  }

  function updateBadgeState(badgeEl, isLive, liveText = "LIVE", offlineText = "Offline") {
    badgeEl.textContent = isLive ? liveText : offlineText;
    badgeEl.classList.toggle("live", isLive);
    badgeEl.classList.remove("is-loading");
  }

  async function refreshBadges(selector, liveText = "LIVE", offlineText = "Offline") {
    const badgeElements = Array.from(document.querySelectorAll(selector));
    const handles = [...new Set(badgeElements.map((el) => el.dataset.tiktokHandle).filter(Boolean))];
    if (!handles.length) return;

    badgeElements.forEach((badgeEl) => badgeEl.classList.add("is-loading"));
    const statusMap = await fetchAllLiveStatuses(handles);

    badgeElements.forEach((badgeEl) => {
      const handle = (badgeEl.dataset.tiktokHandle || "").toLowerCase();
      const isLive = statusMap[handle] === true;
      updateBadgeState(badgeEl, isLive, liveText, offlineText);
    });
  }

  function init() {
    refreshBadges("#runecraft-live-badge", "LIVE NOW", "Offline");
    setInterval(() => refreshBadges("#runecraft-live-badge", "LIVE NOW", "Offline"), 60000);
  }

  async function refreshMemberBadges() {
    await refreshBadges(".member-live-badge[data-tiktok-handle]:not(#runecraft-live-badge):not(#creator-live-badge)");
  }

  async function refreshCreatorBadge() {
    await refreshBadges("#creator-live-badge");
  }

  return { init, refreshMemberBadges, refreshCreatorBadge, fetchAllLiveStatuses };
})();
