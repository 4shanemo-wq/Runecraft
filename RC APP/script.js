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
  { name: "MonkeyingMC", url: "https://www.tiktok.com/@monkeyingaroundyt" },
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
  AJMcSaucy: "SUAZB.png",
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
  MonkeyingMC: "Monkey.png",
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
  AlphieeBuilds: "https://discord.gg/Fjf4XzJGgb",
  DKizzel: "https://discord.gg/5vvNUywdeN",
  "JustJosh Gaming": "https://discord.gg/ePSE2U5K2T",
  Emma: "https://discord.gg/AHPkCunr4p",
  "Tom Frizzle": "https://discord.com/invite/ukNj2RmHu",
  Craftopia: "https://discord.gg/J7FVVfPmvU",
  Seth: "https://discord.gg/J24g9q3sn",
  Twizza: "https://discord.gg/7cbrGG2yDQ",
  JerryCraft: "https://discord.gg/Ahhy8depYB",
  SkepticHailz: "https://discord.gg/gudwTpw5P4",
  EvAdain: "https://discord.gg/hkqd95GQC",
  Secluded: "https://discord.gg/WUwhNcJ2Ng",
  Kooby: "https://discord.gg/hjGNGm8tas",
  MonkeyingMC: "https://discord.gg/YVHfFg6eNG",
  Sab: "https://discord.gg/WFs5yry9Y",
  "Sarah Jo": "https://discord.gg/9CzgwpqBU6",
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
