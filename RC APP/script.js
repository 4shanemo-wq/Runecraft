const members = [
  { name: "AJMcSaucy", url: "https://www.tiktok.com/@ajmcsaucy" },
  { name: "AlphieeBuilds", url: "https://www.tiktok.com/@alphieebuilds" },
  { name: "Broken", url: "https://www.tiktok.com/@broken.f8" },
  { name: "BuzzingSniper", url: "https://www.tiktok.com/@buzzingsniper38" },
  { name: "Craftopia", url: "https://www.tiktok.com/@craftopia770" },
  { name: "DKizzel", url: "https://www.tiktok.com/@d.kizzel" },
  { name: "Emma", url: "https://www.tiktok.com/@emxaxx_mc" },
  { name: "EvAdain", url: "https://www.tiktok.com/@evadain" },
  { name: "JerryCraft", url: "https://www.tiktok.com/@officialjerrycrafttv" },
  { name: "JustJosh Gaming", url: "https://www.tiktok.com/@justj0shgaming" },
  { name: "Kooby", url: "https://www.tiktok.com/@kooby.roory" },
  { name: "MonkeyingAround", url: "https://www.tiktok.com/@monkeyingaroundyt" },
  { name: "Remix", url: "https://www.tiktok.com/@remix.creates" },
  { name: "Sab", url: "https://www.tiktok.com/@sabog.99" },
  { name: "Sarah Jo", url: "https://www.tiktok.com/@theprincess.sarah" },
  { name: "Secluded", url: "https://www.tiktok.com/@secluded_riddle2" },
  { name: "Seth", url: "https://www.tiktok.com/@bettertogetherwithseth" },
  { name: "SkepticHailz", url: "https://www.tiktok.com/@skeptichailz" },
  { name: "Tom Frizzle", url: "https://www.tiktok.com/@frizzlemc" },
  { name: "Twizza", url: "https://www.tiktok.com/@_twizza" },
  { name: "Wya Benny", url: "https://www.tiktok.com/@wya_benny" },
];

const memberGrid = document.querySelector("#member-grid");
const assets = Array.from(document.querySelectorAll(".asset"));
const mouseGlow = document.querySelector(".mouse-glow");
const root = document.documentElement;

const skinMap = {
  AJMcSaucy: "Aj.png",
  AlphieeBuilds: "AlphieeBuilds.png",
  Broken: "BrokenF8.png",
  BuzzingSniper: "BuzzingSniper.png",
  Craftopia: "Craftopia.png",
  DKizzel: "dkizzel.png",
  Emma: "emxaxx.png",
  EvAdain: "EvAdain.png",
  JerryCraft: "Jerrycraft.png",
  "JustJosh Gaming": "Justjosh.png",
  Kooby: "Kooby.png",
  MonkeyingAround: "Monkey.png",
  Remix: "Remix.png",
  Sab: "SUAZB.png",
  "Sarah Jo": "TheActualSarah.png",
  Secluded: "Secluded.png",
  Seth: "BetterTogetherWithSeth.png",
  SkepticHailz: "Hailz.png",
  "Tom Frizzle": "Frizzle.png",
  Twizza: "Twizza.png",
  "Wya Benny": "Benny.png",
};

const discordMap = {
  AJMcSaucy: "https://discord.gg/Bu2YHeyPHf",
  AlphieeBuilds: "https://discord.gg/Fjf4XzJGgb",
  BuzzingSniper: "https://discord.gg/Ahhy8depYB",
  Craftopia: "https://discord.gg/J7FVVfPmvU",
  DKizzel: "https://discord.gg/5vvNUywdeN",
  Emma: "https://discord.gg/AHPkCunr4p",
  EvAdain: "https://discord.gg/hkqd95GQC",
  JerryCraft: "https://discord.gg/Ahhy8depYB",
  "JustJosh Gaming": "https://discord.gg/ePSE2U5K2T",
  Kooby: "https://discord.gg/hjGNGm8tas",
  MonkeyingAround: "https://discord.gg/YVHfFg6eNG",
  Sab: "https://discord.gg/WFs5yry9Y",
  "Sarah Jo": "https://discord.gg/9CzgwpqBU6",
  Secluded: "https://discord.gg/WUwhNcJ2Ng",
  Seth: "https://discord.gg/J24g9q3sn",
  SkepticHailz: "https://discord.gg/gudwTpw5P4",
  "Tom Frizzle": "https://discord.com/invite/ukNj2RmHu",
  Twizza: "https://discord.gg/7cbrGG2yDQ",
  "Wya Benny": "https://discord.gg/CWTrSXe5y",
};

const creatorGradients = {
  AJMcSaucy: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 25%, #ffd45e 50%, #ff6b6b 75%, #ee5a6f 100%)",
  AlphieeBuilds: "linear-gradient(135deg, #4ecdc4 0%, #44b3aa 25%, #1dd1a1 50%, #4ecdc4 75%, #44b3aa 100%)",
  Broken: "linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #ff7675 50%, #a8edea 75%, #fed6e3 100%)",
  BuzzingSniper: "linear-gradient(135deg, #ffd45e 0%, #ffb700 25%, #ff8c00 50%, #ffd45e 75%, #ffb700 100%)",
  Craftopia: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)",
  DKizzel: "linear-gradient(135deg, #f77f00 0%, #d62828 25%, #fcbf49 50%, #f77f00 75%, #d62828 100%)",
  Emma: "linear-gradient(135deg, #ff006e 0%, #d946ef 25%, #c7d0ff 50%, #ff006e 75%, #d946ef 100%)",
  EvAdain: "linear-gradient(135deg, #06ffa5 0%, #12a86f 25%, #0bd1d1 50%, #06ffa5 75%, #12a86f 100%)",
  JerryCraft: "linear-gradient(135deg, #ff8fab 0%, #ff7a8a 25%, #ffa500 50%, #ff8fab 75%, #ff7a8a 100%)",
  "JustJosh Gaming": "linear-gradient(135deg, #118ab2 0%, #06a77d 25%, #ffd45e 50%, #118ab2 75%, #06a77d 100%)",
  Kooby: "linear-gradient(135deg, #9d4edd 0%, #7b2cbf 25%, #5a189a 50%, #9d4edd 75%, #7b2cbf 100%)",
  MonkeyingAround: "linear-gradient(135deg, #f8b739 0%, #d4a574 25%, #4a90e2 50%, #f8b739 75%, #d4a574 100%)",
  Remix: "linear-gradient(135deg, #ff006e 0%, #8338ec 25%, #3a86ff 50%, #ff006e 75%, #8338ec 100%)",
  Sab: "linear-gradient(135deg, #e63946 0%, #a4161a 25%, #fcf0f0 50%, #e63946 75%, #a4161a 100%)",
  "Sarah Jo": "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 25%, #c2185b 50%, #ee9ca7 75%, #ffdde1 100%)",
  Secluded: "linear-gradient(135deg, #1a535c 0%, #4ecdc4 25%, #a7e8be 50%, #1a535c 75%, #4ecdc4 100%)",
  Seth: "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 25%, #226ce0 50%, #fdbb2d 75%, #22c1c3 100%)",
  SkepticHailz: "linear-gradient(135deg, #06aed5 0%, #086788 25%, #f0f3f5 50%, #06aed5 75%, #086788 100%)",
  "Tom Frizzle": "linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #fdb833 50%, #ff6b35 75%, #f7931e 100%)",
  Twizza: "linear-gradient(135deg, #a8dadc 0%, #457b9d 25%, #1d3557 50%, #a8dadc 75%, #457b9d 100%)",
  "Wya Benny": "linear-gradient(135deg, #ffbb00 0%, #ff6b9d 25%, #c44569 50%, #ffbb00 75%, #ff6b9d 100%)",
};

if (memberGrid) {
  const memberMarkup = members
    .map(({ name, url }) => {
      const skinFile = skinMap[name] || "";
      const skinImage = skinFile
        ? `<img class="member-avatar" src="assets/skins/${skinFile}" alt="${name} skin" />`
        : "";
      const discordUrl = discordMap[name];
      const tiktokButton = `<a class="member-link member-link--icon" href="${url}" target="_blank" rel="noreferrer">
              <img src="assets/TikTok.png" alt="Visit ${name} on TikTok" />
            </a>`;
      const discordButton = discordUrl
        ? `<a class="member-link member-link--icon member-link--discord" href="${discordUrl}" target="_blank" rel="noreferrer">
              <img src="assets/Discord.png" alt="Visit ${name} on Discord" />
            </a>`
        : "";

      return `
        <article class="member-card">
          ${skinImage}
          <h3 class="member-name">${name}</h3>
          <div class="member-actions">
            ${tiktokButton}
            ${discordButton}
          </div>
        </article>
      `;
    })
    .join("");

  memberGrid.innerHTML = memberMarkup;
}

// Creator of the Week functionality
function getWeekNumber() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function displayCreatorOfWeek() {
  const creatorShowcaseEl = document.getElementById('creator-showcase');
  if (!creatorShowcaseEl) return;

  const weekNumber = getWeekNumber();
  // Offset to show Craftopia this week - remove this offset for production
  const creatorIndex = (weekNumber - 1 + 10) % members.length;
  const creatorOfWeek = members[creatorIndex];

  const skinFile = skinMap[creatorOfWeek.name] || "";
  const skinImage = skinFile ? `assets/skins/${skinFile}` : "";
  const discordUrl = discordMap[creatorOfWeek.name];
  const tiktokUrl = creatorOfWeek.url;
  const gradient = creatorGradients[creatorOfWeek.name] || "linear-gradient(135deg, #ff6b9d 0%, #c84b8a 25%, #ffd45e 50%, #ff6b9d 75%, #c84b8a 100%)";

  const creatorNameEl = document.getElementById('creator-name');
  creatorNameEl.textContent = creatorOfWeek.name;
  creatorNameEl.style.backgroundImage = gradient;

  document.getElementById('creator-skin').src = skinImage;
  document.getElementById('creator-skin').alt = `${creatorOfWeek.name} skin`;

  if (discordUrl) {
    document.getElementById('creator-discord').href = discordUrl;
    document.getElementById('creator-discord').style.display = 'inline-flex';
  } else {
    document.getElementById('creator-discord').style.display = 'none';
  }

  document.getElementById('creator-tiktok').href = tiktokUrl;
}

displayCreatorOfWeek();

const pointerTarget = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const pointerCurrent = {
  x: pointerTarget.x,
  y: pointerTarget.y,
};

const movePointerTarget = (x, y) => {
  pointerTarget.x = x;
  pointerTarget.y = y;
};

window.addEventListener("pointermove", (event) => {
  movePointerTarget(event.clientX, event.clientY);
});

window.addEventListener(
  "touchmove",
  (event) => {
    const [touch] = event.touches;
    if (touch) {
      movePointerTarget(touch.clientX, touch.clientY);
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (pointerTarget.x > window.innerWidth || pointerTarget.y > window.innerHeight) {
    movePointerTarget(window.innerWidth / 2, window.innerHeight / 2);
  }
});

window.addEventListener("pointerleave", () => {
  movePointerTarget(window.innerWidth / 2, window.innerHeight / 2);
});

const animateScene = () => {
  pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.08;
  pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.08;

  const pointerX = pointerCurrent.x / window.innerWidth - 0.5;
  const pointerY = pointerCurrent.y / window.innerHeight - 0.5;

  root.style.setProperty("--mouse-x", `${pointerCurrent.x}px`);
  root.style.setProperty("--mouse-y", `${pointerCurrent.y}px`);

  assets.forEach((asset) => {
    const depth = Number(asset.dataset.depth || 20);
    const spin = Number(asset.dataset.spin || 8);

    asset.style.setProperty("--shift-x", `${(-pointerX * depth).toFixed(2)}px`);
    asset.style.setProperty("--shift-y", `${(-pointerY * depth).toFixed(2)}px`);
    asset.style.setProperty(
      "--tilt",
      `${(pointerX * spin + pointerY * spin * 0.55).toFixed(2)}deg`
    );
  });

  if (mouseGlow) {
    mouseGlow.style.transform = `translate(${(pointerCurrent.x - 140).toFixed(2)}px, ${(pointerCurrent.y - 140).toFixed(2)}px)`;
  }

  requestAnimationFrame(animateScene);
};

animateScene();

async function updateServerStatus() {
  try {
    const response = await fetch('https://api.mcstatus.io/v2/status/java/31.220.31.100:2204');
    const data = await response.json();

    const statusEl = document.getElementById('server-status');
    const versionEl = document.getElementById('server-version');
    const playersEl = document.getElementById('server-players');
    const playersListEl = document.getElementById('online-players-list');

    if (data.online) {
      statusEl.textContent = 'Online';
      statusEl.className = 'status-online';
      versionEl.textContent = data.version.name_clean;
      playersEl.textContent = `${data.players.online} / ${data.players.max}`;
      playersListEl.innerHTML = data.players.list
        .map((player) => {
          const playerName = player.name_clean || player.name || 'Unknown';
          const avatarUrl = `https://minotar.net/avatar/${encodeURIComponent(playerName)}/40`;
          return `<li><img class="online-player-avatar" src="${avatarUrl}" alt="${playerName} head" /><span>${playerName}</span></li>`;
        })
        .join('');
    } else {
      statusEl.textContent = 'Offline';
      statusEl.className = 'status-offline';
      versionEl.textContent = 'N/A';
      playersEl.textContent = '0 / 0';
      playersListEl.innerHTML = '<li>No players online</li>';
    }
  } catch (error) {
    console.error('Error fetching server status:', error);
    // Fallback to offline state
    const statusEl = document.getElementById('server-status');
    const versionEl = document.getElementById('server-version');
    const playersEl = document.getElementById('server-players');
    const playersListEl = document.getElementById('online-players-list');
    statusEl.textContent = 'Error';
    statusEl.className = 'status-offline';
    versionEl.textContent = 'N/A';
    playersEl.textContent = 'N/A';
    playersListEl.innerHTML = '<li>Unable to load</li>';
  }
}

// Initial load
updateServerStatus();

// Update every 30 seconds
setInterval(updateServerStatus, 30000);
