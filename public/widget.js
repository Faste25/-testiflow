(function () {
  "use strict";

  const APP_URL = document.currentScript
    ? new URL(document.currentScript.src).origin
    : "https://testiflow.com";

  const STYLES = `
    .tf-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .tf-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .tf-title { text-align: center; font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 28px; }
    .tf-wrapper { position: relative; overflow: hidden; }
    .tf-track {
      display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 8px 4px 16px;
      transition: scroll 0.3s ease;
    }
    .tf-track::-webkit-scrollbar { display: none; }
    .tf-card {
      background: #fff; border-radius: 16px; padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      min-width: 280px; max-width: 300px; flex-shrink: 0;
      scroll-snap-align: start; transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .tf-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04); }
    .tf-avatar {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #a78bfa);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; font-size: 15px;
    }
    .tf-name { font-weight: 600; font-size: 14px; color: #111827; }
    .tf-stars { font-size: 13px; margin-top: 2px; }
    .tf-text { font-size: 14px; color: #4b5563; line-height: 1.65; margin: 14px 0; font-style: italic; }
    .tf-video-btn {
      display: flex; align-items: center; gap: 8px; background: #f5f3ff;
      color: #6d28d9; border: none; border-radius: 10px; padding: 9px 14px;
      cursor: pointer; font-size: 13px; font-weight: 600; width: 100%;
      transition: background 0.15s ease;
    }
    .tf-video-btn:hover { background: #ede9fe; }
    .tf-video-btn svg { flex-shrink: 0; }
    .tf-video { width: 100%; border-radius: 10px; margin-top: 10px; max-height: 180px; object-fit: cover; }
    .tf-controls { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 20px; }
    .tf-btn {
      width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid #e5e7eb;
      background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; color: #374151;
    }
    .tf-btn:hover { background: #f3f0ff; border-color: #7c3aed; color: #7c3aed; }
    .tf-dots { display: flex; gap: 6px; align-items: center; }
    .tf-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #d1d5db;
      cursor: pointer; transition: all 0.2s ease;
    }
    .tf-dot.active { background: #7c3aed; width: 18px; border-radius: 3px; }
    .tf-footer { text-align: center; margin-top: 20px; }
    .tf-footer a { font-size: 11px; color: #9ca3af; text-decoration: none; transition: color 0.15s; }
    .tf-footer a:hover { color: #7c3aed; }
    @media (max-width: 640px) {
      .tf-card { min-width: 260px; max-width: 280px; padding: 18px; }
      .tf-title { font-size: 20px; }
    }
  `;

  async function init() {
    injectStyles();
    const containers = document.querySelectorAll("[data-space]");
    containers.forEach((el) => {
      const spaceId = el.getAttribute("data-space");
      const hideBranding = el.getAttribute("data-hide-branding") === "true";
      if (spaceId) renderWall(el, spaceId, hideBranding);
    });
  }

  function injectStyles() {
    if (document.getElementById("tf-styles")) return;
    const style = document.createElement("style");
    style.id = "tf-styles";
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  async function renderWall(container, spaceId, hideBranding) {
    try {
      const res = await fetch(`${APP_URL}/api/widget/${spaceId}`);
      if (!res.ok) return;
      const { testimonials, spaceName } = await res.json();
      if (!testimonials?.length) return;
      container.innerHTML = buildHTML(testimonials, spaceName, hideBranding);
      initCarousel(container, testimonials.length);
    } catch (e) {
      console.error("TestiFlow widget error:", e);
    }
  }

  function stars(rating) {
    if (!rating) return "";
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  function buildHTML(testimonials, spaceName, hideBranding) {
    const cards = testimonials.map((t, i) => `
      <div class="tf-card" data-index="${i}">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
          <div class="tf-avatar">${esc(t.submitter_name.slice(0, 2).toUpperCase())}</div>
          <div>
            <p class="tf-name">${esc(t.submitter_name)}</p>
            ${t.rating ? `<p class="tf-stars" style="color:#f59e0b">${stars(t.rating)}</p>` : ""}
          </div>
        </div>
        ${t.text_content ? `<p class="tf-text">"${esc(t.text_content)}"</p>` : ""}
        ${t.video_url ? `
          <button class="tf-video-btn" onclick="
            this.style.display='none';
            var v=this.nextElementSibling;
            v.style.display='block';
            v.play();
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Ver video testimonio
          </button>
          <video class="tf-video" src="${t.video_url}" controls playsinline preload="none" style="display:none"></video>
        ` : ""}
      </div>
    `).join("");

    const dots = testimonials.map((_, i) =>
      `<span class="tf-dot${i === 0 ? " active" : ""}" data-i="${i}"></span>`
    ).join("");

    return `
      <div class="tf-root">
        <p class="tf-title">❤️ Lo que dicen de ${esc(spaceName ?? "")}</p>
        <div class="tf-wrapper">
          <div class="tf-track">${cards}</div>
        </div>
        <div class="tf-controls">
          <button class="tf-btn tf-prev" aria-label="Anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="tf-dots">${dots}</div>
          <button class="tf-btn tf-next" aria-label="Siguiente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        ${!hideBranding ? `
          <div class="tf-footer">
            <a href="${APP_URL}" target="_blank" rel="noopener">⚡ Powered by TestiFlow</a>
          </div>
        ` : ""}
      </div>
    `;
  }

  function initCarousel(container, total) {
    const track = container.querySelector(".tf-track");
    const prev = container.querySelector(".tf-prev");
    const next = container.querySelector(".tf-next");
    const dots = container.querySelectorAll(".tf-dot");
    if (!track) return;

    let current = 0;

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      const card = track.querySelectorAll(".tf-card")[current];
      if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    prev?.addEventListener("click", () => goTo(current - 1));
    next?.addEventListener("click", () => goTo(current + 1));
    dots.forEach((d) => d.addEventListener("click", () => goTo(+d.dataset.i)));

    // Touch swipe
    let startX = 0;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    // Autoplay
    let timer = setInterval(() => goTo((current + 1) % total), 4000);
    track.addEventListener("mouseenter", () => clearInterval(timer));
    track.addEventListener("mouseleave", () => {
      timer = setInterval(() => goTo((current + 1) % total), 4000);
    });

    // Sync dots on manual scroll
    track.addEventListener("scroll", () => {
      const cards = track.querySelectorAll(".tf-card");
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        if (rect.left >= trackRect.left - 10 && rect.left < trackRect.right) {
          if (current !== i) { current = i; dots.forEach((d, j) => d.classList.toggle("active", j === i)); }
        }
      });
    }, { passive: true });
  }

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
