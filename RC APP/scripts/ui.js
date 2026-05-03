window.RuneCraftUI = (() => {
  const assets = Array.from(document.querySelectorAll(".asset"));
  const mouseGlow = document.querySelector(".mouse-glow");
  const root = document.documentElement;
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const pointerTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pointerCurrent = { x: pointerTarget.x, y: pointerTarget.y };

  function movePointerTarget(x, y) {
    pointerTarget.x = x;
    pointerTarget.y = y;
  }

  function animateScene() {
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
      asset.style.setProperty("--tilt", `${(pointerX * spin + pointerY * spin * 0.55).toFixed(2)}deg`);
    });

    if (mouseGlow) {
      mouseGlow.style.transform = `translate(${(pointerCurrent.x - 140).toFixed(2)}px, ${(pointerCurrent.y - 140).toFixed(2)}px)`;
    }

    requestAnimationFrame(animateScene);
  }

  function bindMenu() {
    if (menuToggle && siteNav) {
      menuToggle.addEventListener("click", () => siteNav.classList.toggle("open"));
    }
  }

  function bindPointer() {
    window.addEventListener("pointermove", (event) => movePointerTarget(event.clientX, event.clientY));
    window.addEventListener("touchmove", (event) => {
      const [touch] = event.touches;
      if (touch) movePointerTarget(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener("resize", () => {
      if (pointerTarget.x > window.innerWidth || pointerTarget.y > window.innerHeight) {
        movePointerTarget(window.innerWidth / 2, window.innerHeight / 2);
      }
    });

    window.addEventListener("pointerleave", () => movePointerTarget(window.innerWidth / 2, window.innerHeight / 2));
  }

  function init() {
    bindMenu();
    bindPointer();
    animateScene();
  }

  return { init };
})();
