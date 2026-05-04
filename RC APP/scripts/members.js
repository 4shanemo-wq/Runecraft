window.RuneCraftMembers = (() => {
  const members = window.RUNECRAFT_MEMBERS || [];
  const rotation = window.RUNECRAFT_CREATOR_ROTATION || {};
  const backendBaseUrl = window.RUNECRAFT_SITE?.config?.backendBaseUrl || "";
  const memberGrid = document.getElementById("member-grid");
  const memberSearch = document.getElementById("member-search");
  const memberResultsCount = document.getElementById("member-results-count");
  const memberSearchEmpty = document.getElementById("member-search-empty");

  function renderLiveBadge(handle) {
    if (!handle) return "";
    return `<span class="member-live-badge is-loading" data-tiktok-handle="${handle}">Checking live...</span>`;
  }

  function renderMemberGrid(query = "") {
    if (!memberGrid) return;

    const normalizedQuery = query.trim().toLowerCase();
    const visibleMembers = members.filter((member) => member.name.toLowerCase().includes(normalizedQuery));

    memberGrid.innerHTML = visibleMembers.map(({ name, tiktok, discord, skin, gradient }) => {
      const skinImage = skin
        ? `<img class="member-avatar" src="assets/skins/${skin}" alt="${name} skin" loading="lazy" />`
        : "";
      const tiktokHandle = window.RuneCraftUtils.getTikTokHandle(tiktok);
      const liveBadge = renderLiveBadge(tiktokHandle);
      const tiktokButton = `<a class="member-link member-link--icon" href="${tiktok}" target="_blank" rel="noreferrer"><img src="assets/TikTok.png" alt="Visit ${name} on TikTok" /></a>`;
      const discordButton = discord
        ? `<a class="member-link member-link--icon member-link--discord" href="${discord}" target="_blank" rel="noreferrer"><img src="assets/Discord.png" alt="Visit ${name} on Discord" /></a>`
        : "";

      return `
        <article class="member-card" style="--card-gradient: ${gradient}">
          ${skinImage}
          <h3 class="member-name">${name}</h3>
          <div class="member-actions">
            ${tiktokButton}
            ${discordButton}
            ${liveBadge}
          </div>
        </article>
      `;
    }).join("");

    if (memberResultsCount) {
      memberResultsCount.textContent = normalizedQuery
        ? `Showing ${visibleMembers.length} of ${members.length} creators`
        : `Showing all ${members.length} creators`;
    }

    if (memberSearchEmpty) {
      memberSearchEmpty.hidden = visibleMembers.length > 0;
    }

    window.RuneCraftLiveStatus?.refreshMemberBadges();
  }

  function normalizeCreatorName(name) {
    return String(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function getWeekNumber() {
    const startDate = rotation.startDate ? new Date(`${rotation.startDate}T00:00:00`) : new Date();
    const now = new Date();
    const currentSunday = new Date(now);
    currentSunday.setHours(0, 0, 0, 0);
    currentSunday.setDate(currentSunday.getDate() - currentSunday.getDay());

    const startSunday = new Date(startDate);
    startSunday.setHours(0, 0, 0, 0);
    startSunday.setDate(startSunday.getDate() - startSunday.getDay());

    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor((currentSunday - startSunday) / msPerWeek);
  }

  async function fetchCreatorHeartCount(creatorName, weekNumber) {
    if (!backendBaseUrl) return 0;
    const params = new URLSearchParams({ creatorName, weekNumber: String(weekNumber) });
    try {
      const response = await fetch(`${backendBaseUrl}/api/creator-hearts?${params}`);
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();
      return Number(data.count || 0);
    } catch (error) {
      console.error("Error fetching creator heart count:", error);
      return 0;
    }
  }

  async function postCreatorHeart(creatorName, weekNumber) {
    if (!backendBaseUrl) throw new Error("Backend URL not configured.");
    const body = { creatorName, weekNumber };
    const response = await fetch(`${backendBaseUrl}/api/creator-hearts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to send heart");
    }
    const data = await response.json();
    return Number(data.count || 0);
  }

  function getCreatorHeartStorageKey(creatorName, weekNumber) {
    return `creator-hearted:${normalizeCreatorName(creatorName)}::${weekNumber}`;
  }

  function markCreatorHearted(creatorName, weekNumber) {
    const storageKey = getCreatorHeartStorageKey(creatorName, weekNumber);
    window.localStorage.setItem(storageKey, "1");
  }

  function hasCreatorHearted(creatorName, weekNumber) {
    const storageKey = getCreatorHeartStorageKey(creatorName, weekNumber);
    return Boolean(window.localStorage.getItem(storageKey));
  }

  async function updateCreatorHeartControls(creatorName, weekNumber) {
    const button = document.getElementById("creator-heart-button");
    const countLabel = document.getElementById("creator-heart-count");
    if (!button || !countLabel) return;

    const hearted = hasCreatorHearted(creatorName, weekNumber);
    button.disabled = true;
    button.textContent = hearted ? "Hearted ❤️" : "Send a Heart ❤️";
    countLabel.classList.add("status-loading");
    countLabel.textContent = "Loading...";

    const count = await fetchCreatorHeartCount(creatorName, weekNumber);
    button.disabled = hearted;
    button.textContent = hearted ? "Hearted ❤️" : "Send a Heart ❤️";
    countLabel.textContent = count;
    countLabel.classList.remove("status-loading");

    button.onclick = async () => {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = "Sending…";
      try {
        const updatedCount = await postCreatorHeart(creatorName, weekNumber);
        countLabel.textContent = updatedCount;
        markCreatorHearted(creatorName, weekNumber);
        button.textContent = "Hearted ❤️";
      } catch (error) {
        console.error("Could not send heart:", error);
        button.disabled = false;
        button.textContent = "Try Again ❤️";
      }
    };
  }

  function renderCreatorOfWeek() {
    const creatorNameEl = document.getElementById("creator-name");
    if (!creatorNameEl) return;

    const schedule = rotation.schedule || [];
    const cycleLength = rotation.cycleLength || schedule.length || 1;
    const weekNumber = getWeekNumber();
    const offset = ((weekNumber % cycleLength) + cycleLength) % cycleLength;
    const creatorName = schedule[offset];
    const creator = members.find((member) => member.name === creatorName);
    if (!creator) return;

    creatorNameEl.textContent = creator.name;
    creatorNameEl.style.backgroundImage = creator.gradient;

    const creatorHandle = window.RuneCraftUtils.getTikTokHandle(creator.tiktok);
    const creatorLiveBadgeEl = document.getElementById("creator-live-badge");
    if (creatorLiveBadgeEl) {
      creatorLiveBadgeEl.dataset.tiktokHandle = creatorHandle || "";
      creatorLiveBadgeEl.textContent = creatorHandle ? "Checking live..." : "No TikTok";
      creatorLiveBadgeEl.classList.add("is-loading");
      creatorLiveBadgeEl.classList.remove("live");
    }

    const creatorSkinEl = document.getElementById("creator-skin");
    if (creatorSkinEl) {
      creatorSkinEl.src = `assets/Creator_Cards/${creator.card}`;
      creatorSkinEl.alt = `${creator.name} Creator Card`;
    }

    const creatorDiscordEl = document.getElementById("creator-discord");
    if (creatorDiscordEl) {
      if (creator.discord) {
        creatorDiscordEl.href = creator.discord;
        creatorDiscordEl.style.display = "inline-flex";
      } else {
        creatorDiscordEl.style.display = "none";
      }
    }

    const creatorTikTokEl = document.getElementById("creator-tiktok");
    if (creatorTikTokEl) {
      creatorTikTokEl.href = creator.tiktok;
    }

    updateCreatorHeartControls(creator.name, weekNumber);
    window.RuneCraftLiveStatus?.refreshCreatorBadge();
  }

  function bindSearch() {
    if (!memberSearch) return;
    memberSearch.addEventListener("input", () => renderMemberGrid(memberSearch.value || ""));
  }

  function init() {
    renderMemberGrid();
    renderCreatorOfWeek();
    bindSearch();
    setInterval(() => window.RuneCraftLiveStatus?.refreshCreatorBadge(), 60000);
    setInterval(() => window.RuneCraftLiveStatus?.refreshMemberBadges(), 60000);
  }

  return { init };
})();
