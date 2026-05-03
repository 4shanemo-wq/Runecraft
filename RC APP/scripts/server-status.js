window.RuneCraftServerStatus = (() => {
  const serverStatusUrl = window.RUNECRAFT_SITE?.config?.serverStatusUrl || "";

  async function updateServerStatus() {
    const statusEl = document.getElementById("server-status");
    const versionEl = document.getElementById("server-version");
    const playersEl = document.getElementById("server-players");
    const playersListEl = document.getElementById("online-players-list");

    try {
      const response = await fetch(serverStatusUrl);
      const data = await response.json();

      if (data.online) {
        statusEl.textContent = "Online";
        statusEl.className = "status-online";
        versionEl.textContent = data.version.name_clean;
        versionEl.classList.remove("status-loading");
        playersEl.textContent = `${data.players.online} / ${data.players.max}`;
        playersEl.classList.remove("status-loading");
        playersListEl.innerHTML = data.players.list.map((player) => {
          const playerName = player.name_clean || player.name || "Unknown";
          const avatarUrl = `https://minotar.net/avatar/${encodeURIComponent(playerName)}/40`;
          return `<li><img class="online-player-avatar" src="${avatarUrl}" alt="${playerName} head" /><span>${playerName}</span></li>`;
        }).join("");
      } else {
        statusEl.textContent = "Offline";
        statusEl.className = "status-offline";
        versionEl.textContent = "N/A";
        versionEl.classList.remove("status-loading");
        playersEl.textContent = "0 / 0";
        playersEl.classList.remove("status-loading");
        playersListEl.innerHTML = "<li>No players online</li>";
      }
    } catch (error) {
      console.error("Error fetching server status:", error);
      statusEl.textContent = "Error";
      statusEl.className = "status-offline";
      versionEl.textContent = "N/A";
      versionEl.classList.remove("status-loading");
      playersEl.textContent = "N/A";
      playersEl.classList.remove("status-loading");
      playersListEl.innerHTML = "<li>Unable to load</li>";
    }
  }

  function init() {
    updateServerStatus();
    setInterval(updateServerStatus, 30000);
  }

  return { init };
})();
