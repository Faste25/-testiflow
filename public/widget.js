(function () {
  "use strict";

  const APP_URL = document.currentScript
    ? new URL(document.currentScript.src).origin
    : "https://testiflow.com";

  // ─── Styles ───────────────────────────────────────────────────────────────
  const STYLES = `
    .tf-root *, .tf-root *::before, .tf-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .tf-root {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
      --tf-bg: #ffffff;
      --tf-card: #ffffff;
      --tf-border: rgba(0,0,0,0.07);
      --tf-text-primary: #0f172a;
      --tf-text-secondary: #475569;
      --tf-text-muted: #94a3b8;
      --tf-accent: #6366f1;
      --tf-accent-light: #eef2ff;
      --tf-shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --tf-shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
      --tf-shadow-lg: 0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      --tf-radius: 16px;
      --tf-star: #f59e0b;
    }

    @media (prefers-color-scheme: dark) {
      .tf-root {
        --tf-bg: #0f172a;
        --tf-card: #1e293b;
        --tf-border: rgba(255,255,255,0.08);
        --tf-text-primary: #f1f5f9;
        --tf-text-secondary: #94a3b8;
        --tf-text-muted: #475569;
        --tf-accent: #818cf8;
        --tf-accent-light: rgba(99,102,241,0.12);
        --tf-shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
        --tf-shadow-md: 0 4px 16px rgba(0,0,0,0.4);
        --tf-shadow-lg: 0 12px 32px rgba(0,0,0,0.5);
      }
    }

    .tf-root { background: var(--tf-bg); padding: 8px 0 24px; }

    .tf-header { text-align: center; margin-bottom: 32px; }
    .tf-title {
      font-size: clamp(20px, 3vw, 28px); font-weight: 800;
      color: var(--tf-text-primary); letter-spacing: -0.5px; line-height: 1.2;
    }
    .tf-subtitle { font-size: 14px; color: var(--tf-text-muted); margin-top: 6px; }

    .tf-wrapper { position: relative; }

    .tf-track {
      display: flex; gap: 16px; overflow-x: auto;
      scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
      scrollbar-width: none; padding: 12px 20px 20px;
    }
    .tf-track::-webkit-scrollbar { display: none; }

    .tf-card {
      background: var(--tf-card);
      border: 1px solid var(--tf-border);
      border-radius: var(--tf-radius);
      padding: 22px;
      min-width: 290px; max-width: 310px;
      flex-shrink: 0; scroll-snap-align: start;
      box-shadow: var(--tf-shadow-sm);
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
      cursor: default;
    }
    .tf-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: var(--tf-shadow-lg);
    }

    .tf-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }

    .tf-avatar {
      width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; font-size: 16px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
      box-shadow: 0 2px 8px rgba(99,102,241,0.35);
    }
    .tf-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

    .tf-author-name { font-weight: 700; font-size: 14px; color: var(--tf-text-primary); line-height: 1.3; }
    .tf-author-role { font-size: 12px; color: var(--tf-text-muted); margin-top: 1px; }

    .tf-stars { display: flex; gap: 2px; margin-bottom: 10px; }
    .tf-star { font-size: 15px; line-height: 1; transition: transform 0.15s ease; }
    .tf-star:hover { transform: scale(1.2); }
    .tf-star-filled { color: var(--tf-star); }
    .tf-star-empty { color: #e2e8f0; }

    .tf-text {
      font-size: 14px; color: var(--tf-text-secondary); line-height: 1.7;
      margin-bottom: 14px; font-style: italic;
      display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;
    }
    .tf-text::before { content: '\\201C'; font-size: 20px; color: var(--tf-accent); font-style: normal; line-height: 0; vertical-align: -6px; margin-right: 2px; }
    .tf-text::after { content: '\\201D'; font-size: 20px; color: var(--tf-accent); font-style: normal; line-height: 0; vertical-align: -6px; margin-left: 2px; }

    .tf-video-wrapper { border-radius: 10px; overflow: hidden; position: relative; background: #0f172a; aspect-ratio: 16/9; margin-top: 4px; }
    .tf-video-wrapper video { width: 100%; height: 100%; object-fit: cover; display: block; }

    .tf-video-overlay {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.3); cursor: pointer; transition: background 0.2s ease;
    }
    .tf-video-overlay:hover { background: rgba(0,0,0,0.15); }
    .tf-play-btn {
      width: 48px; height: 48px; border-radius: 50%;
      background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3); transition: transform 0.2s ease;
    }
    .tf-video-overlay:hover .tf-play-btn { transform: scale(1.1); }
    .tf-play-icon { width: 18px; height: 18px; fill: #6366f1; margin-left: 3px; }

    .tf-date { font-size: 11px; color: var(--tf-text-muted); margin-top: 12px; }

    .tf-controls {
      display: flex; justify-content: center; align-items: center;
      gap: 14px; margin-top: 16px; padding: 0 20px;
    }
    .tf-nav-btn {
      width: 40px; height: 40px; border-radius: 50%;
      border: 1.5px solid var(--tf-border); background: var(--tf-card);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: var(--tf-text-secondary); box-shadow: var(--tf-shadow-sm);
      transition: all 0.2s ease; flex-shrink: 0;
    }
    .tf-nav-btn:hover { border-color: var(--tf-accent); color: var(--tf-accent); background: var(--tf-accent-light); box-shadow: var(--tf-shadow-md); }
    .tf-nav-btn svg { width: 16px; height: 16px; }

    .tf-dots { display: flex; gap: 6px; align-items: center; }
    .tf-dot {
      height: 7px; border-radius: 4px; background: var(--tf-border);
      cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      width: 7px;
    }
    .tf-dot:hover { background: var(--tf-accent); opacity: 0.6; }
    .tf-dot.tf-active { background: var(--tf-accent); width: 22px; }

    .tf-branding {
      text-align: center; margin-top: 20px;
    }
    .tf-branding a {
      font-size: 11px; color: var(--tf-text-muted); text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px;
      transition: color 0.2s ease; letter-spacing: 0.2px;
    }
    .tf-branding a:hover { color: var(--tf-accent); }

    .tf-empty {
      text-align: center; padding: 40px 20px; color: var(--tf-text-muted); font-size: 14px;
    }

    @media (max-width: 480px) {
      .tf-card { min-width: 268px; max-width: 288px; padding: 18px; }
      .tf-track { padding: 8px 16px 16px; gap: 12px; }
      .tf-title { font-size: 20px; }
    }
  `;

  // ─── Init ─────────────────────────────────────────────────────────────────
  async function init() {
    injectStyles();
    document.querySelectorAll("[data-space]").forEach((el) => {
      const spaceId = el.getAttribute("data-space");
      const hideBranding = el.hasAttribute("data-hide-branding");
      const theme = el.getAttribute("data-theme") || "auto";
      if (spaceId) renderWall(el, spaceId, hideBranding, theme);
    });
  }

  function injectStyles() {
    if (document.getElementById("tf-styles")) return;
    const s = document.createElement("style");
    s.id = "tf-styles";
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  async function renderWall(container, spaceId, hideBranding, theme) {
    try {
      container.innerHTML = `<div class="tf-root tf-theme-${theme}"><div class="tf-empty">Cargando testimonios...</div></div>`;
      const res = await fetch(`${APP_URL}/api/widget/${spaceId}`);
      if (!res.ok) { container.innerHTML = ""; return; }
      const { testimonials, spaceName } = await res.json();
      if (!testimonials?.length) { container.innerHTML = ""; return; }
      container.innerHTML = buildHTML(testimonials, spaceName, hideBranding);
      initCarousel(container, testimonials.length);
      initVideos(container);
    } catch (e) {
      console.error("TestiFlow:", e);
    }
  }

  // ─── HTML Builder ─────────────────────────────────────────────────────────
  function buildHTML(testimonials, spaceName, hideBranding) {
    const cards = testimonials.map((t, i) => buildCard(t, i)).join("");
    const dots = testimonials.map((_, i) =>
      `<span class="tf-dot${i === 0 ? " tf-active" : ""}" data-i="${i}" role="button" aria-label="Ir al testimonio ${i + 1}"></span>`
    ).join("");

    return `
      <div class="tf-root">
        <div class="tf-header">
          <p class="tf-title">❤️ Lo que dicen nuestros clientes</p>
          <p class="tf-subtitle">${esc(spaceName ?? "")}</p>
        </div>
        <div class="tf-wrapper">
          <div class="tf-track" role="list">${cards}</div>
        </div>
        <div class="tf-controls">
          <button class="tf-nav-btn tf-prev" aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="tf-dots" role="tablist">${dots}</div>
          <button class="tf-nav-btn tf-next" aria-label="Siguiente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        ${!hideBranding ? `
          <div class="tf-branding">
            <a href="${APP_URL}" target="_blank" rel="noopener noreferrer">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Powered by TestiFlow
            </a>
          </div>
        ` : ""}
      </div>
    `;
  }

  function buildCard(t, i) {
    const initials = t.submitter_name.slice(0, 2).toUpperCase();
    const starsHtml = t.rating ? buildStars(t.rating) : "";
    const dateHtml = t.created_at
      ? `<p class="tf-date">${new Date(t.created_at).toLocaleDateString("es", { year: "numeric", month: "short", day: "numeric" })}</p>`
      : "";

    return `
      <div class="tf-card" role="listitem" data-index="${i}">
        <div class="tf-card-header">
          <div class="tf-avatar">${initials}</div>
          <div>
            <p class="tf-author-name">${esc(t.submitter_name)}</p>
            ${t.submitter_role ? `<p class="tf-author-role">${esc(t.submitter_role)}</p>` : ""}
          </div>
        </div>
        ${starsHtml}
        ${t.text_content ? `<p class="tf-text">${esc(t.text_content)}</p>` : ""}
        ${t.video_url ? buildVideoHTML(t.video_url) : ""}
        ${dateHtml}
      </div>
    `;
  }

  function buildStars(rating) {
    let html = '<div class="tf-stars">';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="tf-star ${i <= rating ? "tf-star-filled" : "tf-star-empty"}">★</span>`;
    }
    return html + "</div>";
  }

  function buildVideoHTML(url) {
    return `
      <div class="tf-video-wrapper">
        <video src="${esc(url)}" preload="none" playsinline loop muted></video>
        <div class="tf-video-overlay" role="button" aria-label="Reproducir video" tabindex="0">
          <div class="tf-play-btn">
            <svg class="tf-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Video interactions ───────────────────────────────────────────────────
  function initVideos(container) {
    container.querySelectorAll(".tf-video-overlay").forEach((overlay) => {
      const wrapper = overlay.closest(".tf-video-wrapper");
      const video = wrapper?.querySelector("video");
      if (!video) return;

      function play() {
        video.muted = false;
        video.play().catch(() => { video.muted = true; video.play(); });
        overlay.style.display = "none";
      }

      overlay.addEventListener("click", play);
      overlay.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") play(); });
    });

    // Autoplay muted on hover
    container.querySelectorAll(".tf-card").forEach((card) => {
      const video = card.querySelector("video");
      if (!video) return;
      card.addEventListener("mouseenter", () => { video.muted = true; video.play().catch(() => {}); });
      card.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
    });
  }

  // ─── Carousel ─────────────────────────────────────────────────────────────
  function initCarousel(container, total) {
    const track = container.querySelector(".tf-track");
    const prev = container.querySelector(".tf-prev");
    const next = container.querySelector(".tf-next");
    const dots = container.querySelectorAll(".tf-dot");
    if (!track || total <= 1) { prev?.remove(); next?.remove(); return; }

    let current = 0;
    let autoTimer = null;

    function goTo(index, animate = true) {
      current = ((index % total) + total) % total;
      const card = track.querySelectorAll(".tf-card")[current];
      if (card) card.scrollIntoView({ behavior: animate ? "smooth" : "auto", block: "nearest", inline: "start" });
      dots.forEach((d, i) => d.classList.toggle("tf-active", i === current));
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto() { clearInterval(autoTimer); }

    prev?.addEventListener("click", () => { goTo(current - 1); startAuto(); });
    next?.addEventListener("click", () => { goTo(current + 1); startAuto(); });
    dots.forEach((d) => d.addEventListener("click", () => { goTo(+d.dataset.i); startAuto(); }));

    // Pause autoplay on interaction
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
    track.addEventListener("touchstart", stopAuto, { passive: true });
    track.addEventListener("touchend", startAuto, { passive: true });

    // Touch swipe
    let touchStartX = 0, touchStartY = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        goTo(dx > 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    // Sync dots on scroll
    let scrollTimer;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const trackLeft = track.getBoundingClientRect().left;
        let closest = 0, minDist = Infinity;
        track.querySelectorAll(".tf-card").forEach((card, i) => {
          const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        current = closest;
        dots.forEach((d, i) => d.classList.toggle("tf-active", i === closest));
      }, 80);
    }, { passive: true });

    startAuto();
  }

  // ─── Utils ────────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /*
  ──────────────────────────────────────────────
  EJEMPLO DE USO:

  Plan Free:
  <div id="testiflow-wall" data-space="TU_SPACE_ID"></div>
  <script src="https://testiflow.com/widget.js" async></script>

  Plan Pro (sin branding):
  <div id="testiflow-wall" data-space="TU_SPACE_ID" data-hide-branding></div>
  <script src="https://testiflow.com/widget.js" async></script>

  Tema oscuro forzado:
  <div data-space="TU_SPACE_ID" data-theme="dark"></div>
  ──────────────────────────────────────────────
  */
})();
