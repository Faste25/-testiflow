(function () {
  "use strict";

  const APP_URL = document.currentScript
    ? new URL(document.currentScript.src).origin
    : "https://testiflow.com";

  async function init() {
    const containers = document.querySelectorAll("[data-space]");
    containers.forEach((container) => {
      const spaceId = container.getAttribute("data-space");
      if (spaceId) renderWall(container, spaceId);
    });
  }

  async function renderWall(container, spaceId) {
    try {
      const res = await fetch(`${APP_URL}/api/widget/${spaceId}`);
      if (!res.ok) return;
      const { testimonials, spaceName } = await res.json();
      if (!testimonials?.length) return;
      container.innerHTML = buildHTML(testimonials, spaceName);
      initCarousel(container);
    } catch (e) {
      console.error("TestiFlow widget error:", e);
    }
  }

  function buildHTML(testimonials, spaceName) {
    const cards = testimonials
      .map(
        (t) => `
      <div class="tf-card" style="
        background:#fff;
        border-radius:16px;
        padding:24px;
        box-shadow:0 2px 12px rgba(0,0,0,0.08);
        min-width:280px;
        max-width:320px;
        flex-shrink:0;
        snap-align:start;
      ">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="
            width:40px;height:40px;border-radius:50%;
            background:linear-gradient(135deg,#7c3aed,#a78bfa);
            display:flex;align-items:center;justify-content:center;
            font-weight:700;color:#fff;font-size:14px;flex-shrink:0;
          ">${t.submitter_name.slice(0, 2).toUpperCase()}</div>
          <div>
            <p style="font-weight:600;font-size:14px;color:#111;margin:0">${escHtml(t.submitter_name)}</p>
            ${t.rating ? `<p style="margin:2px 0 0;font-size:13px">${"⭐".repeat(t.rating)}</p>` : ""}
          </div>
        </div>
        ${t.text_content ? `<p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 14px">"${escHtml(t.text_content)}"</p>` : ""}
        ${
          t.video_url
            ? `<button onclick="this.nextElementSibling.style.display='block';this.style.display='none'" style="
                display:flex;align-items:center;gap:8px;
                background:#f3f0ff;color:#6d28d9;border:none;
                border-radius:8px;padding:8px 14px;cursor:pointer;font-size:13px;font-weight:500;
              ">▶ Ver video</button>
              <video src="${t.video_url}" controls style="width:100%;border-radius:8px;display:none;margin-top:8px"></video>`
            : ""
        }
      </div>
    `
      )
      .join("");

    return `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
        <p style="text-align:center;font-size:22px;font-weight:700;color:#111;margin:0 0 24px">
          ❤️ Lo que dicen de ${escHtml(spaceName ?? "")}
        </p>
        <div class="tf-track" style="
          display:flex;gap:16px;overflow-x:auto;padding-bottom:12px;
          scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;
          scrollbar-width:none;
        ">${cards}</div>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:16px">
          <button class="tf-prev" style="
            width:36px;height:36px;border-radius:50%;border:1px solid #e5e7eb;
            background:#fff;cursor:pointer;font-size:16px;
          ">‹</button>
          <button class="tf-next" style="
            width:36px;height:36px;border-radius:50%;border:1px solid #e5e7eb;
            background:#fff;cursor:pointer;font-size:16px;
          ">›</button>
        </div>
        <p style="text-align:center;margin-top:12px;font-size:11px;color:#9ca3af">
          Powered by <a href="${APP_URL}" style="color:#7c3aed;text-decoration:none">TestiFlow</a>
        </p>
      </div>
    `;
  }

  function initCarousel(container) {
    const track = container.querySelector(".tf-track");
    const prev = container.querySelector(".tf-prev");
    const next = container.querySelector(".tf-next");
    if (!track || !prev || !next) return;

    const scroll = (dir) => {
      track.scrollBy({ left: dir * 310, behavior: "smooth" });
    };

    prev.addEventListener("click", () => scroll(-1));
    next.addEventListener("click", () => scroll(1));
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
