window.RuneCraftGallery = (() => {
  const galleryItems = Array.isArray(window.RUNECRAFT_GALLERY) ? window.RUNECRAFT_GALLERY : [];
  const galleryFeature = document.getElementById("gallery-feature");
  const galleryFeatureImage = document.getElementById("gallery-feature-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryThumbs = document.getElementById("gallery-thumbs");
  const galleryPrev = document.getElementById("gallery-prev");
  const galleryNext = document.getElementById("gallery-next");
  const galleryExpand = document.getElementById("gallery-expand");
  const galleryLightbox = document.getElementById("gallery-lightbox");
  const galleryLightboxImage = document.getElementById("gallery-lightbox-image");
  const galleryLightboxCaption = document.getElementById("gallery-lightbox-caption");
  const galleryLightboxClose = document.getElementById("gallery-lightbox-close");
  const galleryLightboxPrev = document.getElementById("gallery-lightbox-prev");
  const galleryLightboxNext = document.getElementById("gallery-lightbox-next");
  const galleryBackdrop = document.querySelector("[data-gallery-close='true']");
  const galleryState = { currentIndex: 0 };

  function clampGalleryIndex(index) {
    return (index + galleryItems.length) % galleryItems.length;
  }

  function syncLightboxImage() {
    if (!galleryLightbox || galleryLightbox.hidden) return;
    const item = galleryItems[galleryState.currentIndex];
    galleryLightboxImage.src = item.full;
    galleryLightboxImage.alt = item.alt;
    galleryLightboxCaption.textContent = item.caption;
  }

  function renderGallery(index) {
    if (!galleryItems.length || !galleryFeatureImage || !galleryCaption || !galleryThumbs) return;
    galleryState.currentIndex = clampGalleryIndex(index);
    const item = galleryItems[galleryState.currentIndex];
    galleryFeatureImage.src = item.full;
    galleryFeatureImage.alt = item.alt;
    galleryCaption.textContent = item.caption;

    Array.from(galleryThumbs.querySelectorAll(".gallery-thumb")).forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === galleryState.currentIndex);
      if (thumbIndex === galleryState.currentIndex) {
        thumb.setAttribute("aria-current", "true");
      } else {
        thumb.removeAttribute("aria-current");
      }
    });

    syncLightboxImage();
  }

  function openGalleryLightbox(index = galleryState.currentIndex) {
    if (!galleryLightbox) return;
    galleryLightbox.hidden = false;
    document.body.classList.add("modal-open");
    renderGallery(index);
    syncLightboxImage();
  }

  function closeGalleryLightbox() {
    if (!galleryLightbox) return;
    galleryLightbox.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function buildGalleryThumbs() {
    if (!galleryThumbs) return;
    galleryThumbs.innerHTML = galleryItems.map((item, index) => `
      <button class="gallery-thumb${index === 0 ? " is-active" : ""}" type="button" data-gallery-index="${index}" aria-label="Show ${item.caption}">
        <img src="${item.thumb}" alt="${item.alt}" loading="lazy" decoding="async" />
      </button>
    `).join("");

    galleryThumbs.querySelectorAll(".gallery-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => renderGallery(Number(thumb.dataset.galleryIndex)));
    });
  }

  function bindEvents() {
    galleryPrev?.addEventListener("click", () => renderGallery(galleryState.currentIndex - 1));
    galleryNext?.addEventListener("click", () => renderGallery(galleryState.currentIndex + 1));
    galleryFeature?.addEventListener("click", () => openGalleryLightbox(galleryState.currentIndex));
    galleryExpand?.addEventListener("click", () => openGalleryLightbox(galleryState.currentIndex));
    galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);
    galleryBackdrop?.addEventListener("click", closeGalleryLightbox);
    galleryLightboxPrev?.addEventListener("click", () => renderGallery(galleryState.currentIndex - 1));
    galleryLightboxNext?.addEventListener("click", () => renderGallery(galleryState.currentIndex + 1));

    document.addEventListener("keydown", (event) => {
      if (!galleryLightbox || galleryLightbox.hidden) return;
      if (event.key === "Escape") closeGalleryLightbox();
      if (event.key === "ArrowLeft") renderGallery(galleryState.currentIndex - 1);
      if (event.key === "ArrowRight") renderGallery(galleryState.currentIndex + 1);
    });
  }

  function init() {
    if (!galleryItems.length || !galleryFeatureImage || !galleryCaption || !galleryThumbs) return;
    buildGalleryThumbs();
    renderGallery(0);
    bindEvents();
  }

  return { init };
})();
