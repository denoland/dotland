const url = new URL(location.href);
const path = url.pathname;

// deno-lint-ignore no-window-prefix
window.addEventListener("DOMContentLoaded", (_) => {
  const el = document.querySelector(
    `#SidePanelScrollContainer a[href="${path}"]`,
  );
  const containerEl = document.querySelector("#SidePanelScrollContainer");
  const containerRect = containerEl.getBoundingClientRect();

  const rect = el.getBoundingClientRect();
  containerEl.scrollTop = rect.top - containerRect.top -
    containerRect.height / 3;
});
