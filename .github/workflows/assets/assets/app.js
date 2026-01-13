// Stage 1: navigation, dark mode, and "open full screen" link.
// Stage 2+ will add DATA, search indexing, and content rendering.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ROUTES = ["home","glossary","games","revision","resources","exam","composition","logic","printables","answers"];

function setRoute(route){
  if(!ROUTES.includes(route)) route = "home";

  // nav highlight
  $$(".nav__item").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.route === route);
  });

  // page show/hide
  $$(".page").forEach(p => {
    p.classList.toggle("is-active", p.dataset.page === route);
  });

  // remember last route
  localStorage.setItem("mt_route", route);

  // update hash without jumpy scroll
  const newHash = `#${route}`;
  if (location.hash !== newHash) history.replaceState(null, "", newHash);
}

function initRouting(){
  // click routing
  $("#nav").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav__item");
    if(!btn) return;
    setRoute(btn.dataset.route);
  });

  // initial route: hash > storage > home
  const hash = (location.hash || "").replace("#","").trim();
  const stored = localStorage.getItem("mt_route");
  setRoute(hash || stored || "home");

  // back/forward hash changes
  window.addEventListener("hashchange", () => {
    const h = (location.hash || "").replace("#","").trim();
    if (h) setRoute(h);
  });
}

function initTheme(){
  const key = "mt_theme";
  const btn = $("#darkToggle");

  const stored = localStorage.getItem(key);
  if (stored === "light") document.documentElement.dataset.theme = "light";

  function applyLabel(){
    const isLight = document.documentElement.dataset.theme === "light";
    btn.textContent = isLight ? "Dark mode" : "Light mode";
    btn.setAttribute("aria-pressed", String(!isLight));
  }

  btn.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    if (isLight) {
      delete document.documentElement.dataset.theme;
      localStorage.setItem(key, "dark");
    } else {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem(key, "light");
    }
    applyLabel();
  });

  applyLabel();
}

function initOpenStandalone(){
  // This link should open the GitHub Pages URL when hosted,
  // or just open the same document in a new tab if embedded.
  const a = $("#openStandalone");
  a.href = window.location.href;
}

function initSearchPlaceholder(){
  const input = $("#globalSearch");
  input.addEventListener("input", () => {
    // Stage 2 will actually filter content. For now, just a friendly placeholder.
    // Avoid banned words; keep it mild.
    const v = input.value.trim();
    input.title = v ? `Search term: "${v}" (Stage 2 activates real search)` : "Search (Stage 2 activates real search)";
  });
}

function initPanic(){
  // Stage 4 will wire this to stop all WebAudio nodes.
  $("#panicBtn").addEventListener("click", () => {
    alert("PANIC is wired in Stage 4 when audio exists. For now: emotionally panic only.");
  });
}

initRouting();
initTheme();
initOpenStandalone();
initSearchPlaceholder();
initPanic();
