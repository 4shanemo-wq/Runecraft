window.RuneCraftContent = (() => {
  const site = window.RUNECRAFT_SITE || {};

  function renderAbout() {
    const about = site.about || {};
    const titleEl = document.getElementById("about-title");
    const copyEl = document.getElementById("about-copy");
    const listEl = document.getElementById("about-list");

    if (titleEl && about.title) titleEl.textContent = about.title;
    if (copyEl && about.copy) copyEl.textContent = about.copy;
    if (listEl) {
      listEl.innerHTML = (about.highlights || []).map((item) => `<li>${item}</li>`).join("");
    }
  }

  function renderAdmins() {
    const adminGrid = document.getElementById("admin-grid");
    if (!adminGrid) return;

    adminGrid.innerHTML = (site.admins || []).map((admin) => `
      <article class="admin-card">
        <img class="admin-avatar" src="assets/skins/${admin.skin}" alt="${admin.name} admin skin" loading="lazy" />
        <h3 class="admin-name">${admin.name}</h3>
        <p class="admin-role">${admin.role}</p>
      </article>
    `).join("");
  }

  function renderFaq() {
    const faqList = document.getElementById("faq-list");
    if (!faqList) return;

    faqList.innerHTML = (site.faq || []).map((item) => `
      <details class="faq-item">
        <summary>${item.question}</summary>
        <p>${item.answer}</p>
      </details>
    `).join("");
  }

  function renderEvents() {
    const eventsList = document.getElementById("events-list");
    if (!eventsList) return;

    eventsList.innerHTML = (site.events || []).map((event) => {
      const hostMarkup = event.host ? `<p><strong>Host:</strong> ${event.host}</p>` : "";
      const noteMarkup = event.note ? `<p class="event-note">${event.note}</p>` : "";
      const linkMarkup = event.linkUrl
        ? `<a class="event-link" href="${event.linkUrl}" target="_blank" rel="noreferrer">${event.linkLabel || "Learn More"}</a>`
        : "";

      return `
        <article class="event-item">
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${event.date}</p>
          ${hostMarkup}
          <p>${event.description}</p>
          ${noteMarkup}
          ${linkMarkup}
        </article>
      `;
    }).join("");
  }

  function renderChangelog() {
    const changelogList = document.getElementById("changelog-list");
    if (!changelogList) return;

    changelogList.innerHTML = (site.changelog || []).map((item) => `
      <article class="changelog-item">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </article>
    `).join("");
  }

  function applyMapDescription() {
    const descriptionEl = document.getElementById("map-description");
    if (descriptionEl && site.map?.description) {
      descriptionEl.textContent = site.map.description;
    }
  }

  function init() {
    renderAbout();
    renderAdmins();
    renderFaq();
    renderEvents();
    renderChangelog();
    applyMapDescription();
  }

  return { init };
})();
