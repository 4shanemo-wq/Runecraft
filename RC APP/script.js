const members = [
  { name: "AlphieeBuilds", url: "https://www.tiktok.com/@alphieebuilds" },
  { name: "DKizzel", url: "https://www.tiktok.com/@d.kizzel" },
  { name: "EvAdain", url: "https://www.tiktok.com/@evadain" },
  { name: "JerryCraft", url: "https://www.tiktok.com/@officialjerrycrafttv" },
  { name: "Emma", url: "https://www.tiktok.com/@emxaxx_mc" },
  { name: "AJMcSaucy", url: "https://www.tiktok.com/@ajmcsaucy" },
  { name: "Sab", url: "https://www.tiktok.com/@sabog.99" },
  { name: "Tom Frizzle", url: "https://www.tiktok.com/@frizzlemc" },
  { name: "Craftopia", url: "https://www.tiktok.com/@craftopia770" },
  { name: "Seth", url: "https://www.tiktok.com/@bettertogetherwithseth" },
  { name: "Secluded", url: "https://www.tiktok.com/@secluded_riddle2" },
  { name: "Wya Benny", url: "https://www.tiktok.com/@wya_benny" },
  { name: "Sarah Jo", url: "https://www.tiktok.com/@theprincess.sarah" },
  { name: "SkepticHailz", url: "https://www.tiktok.com/@skeptichailz" },
  { name: "Twizza", url: "https://www.tiktok.com/@_twizza" },
  { name: "Kooby", url: "https://www.tiktok.com/@kooby.roory" },
  { name: "Broken", url: "https://www.tiktok.com/@broken.f8" },
  { name: "BuzzingSniper", url: "https://www.tiktok.com/@buzzingsniper38" },
  { name: "Remix", url: "https://www.tiktok.com/@remix.creates" },
  { name: "JustJosh Gmaing", url: "https://www.tiktok.com/@justj0shgaming" },
  { name: "MonkeyingMC", url: "https://www.tiktok.com/@monkeyingaroundyt" },
];

const memberGrid = document.querySelector("#member-grid");
const assets = Array.from(document.querySelectorAll(".asset"));
const mouseGlow = document.querySelector(".mouse-glow");
const root = document.documentElement;

if (memberGrid) {
  const memberMarkup = members
    .map(
      ({ name, url }) => `
        <article class="member-card">
          <h3 class="member-name">${name}</h3>
          <a class="member-link" href="${url}" target="_blank" rel="noreferrer">
            Visit TikTok
          </a>
        </article>
      `
    )
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
