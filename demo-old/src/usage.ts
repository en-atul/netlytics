import "./style.css";

const tabButtons = document.querySelectorAll<HTMLButtonElement>("[data-tab]");
const tabContents = document.querySelectorAll<HTMLElement>("[data-content]");
const frameworkLinks = document.querySelectorAll<HTMLAnchorElement>("[data-framework]");

function getHashTab(): string {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (["react", "vue", "angular", "svelte", "js"].includes(hash)) return hash;
  return "react";
}

function setActiveTab(targetTab: string, updateHash = false) {
  tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === targetTab));
  tabContents.forEach((c) => c.classList.toggle("active", c.dataset.content === targetTab));
  frameworkLinks.forEach((a) => a.classList.toggle("active", a.dataset.framework === targetTab));
  if (updateHash) window.location.hash = targetTab;
}

// Initialize from hash
const initialTab = getHashTab();
setActiveTab(initialTab);

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTab = btn.dataset.tab;
    if (targetTab) setActiveTab(targetTab, true);
  });
});

frameworkLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetTab = link.dataset.framework;
    if (targetTab) {
      setActiveTab(targetTab, true);
      e.preventDefault();
    }
  });
});

window.addEventListener("hashchange", () => {
  setActiveTab(getHashTab());
});

const Prism = (window as Window & { Prism?: { highlightAll: () => void } }).Prism;
if (Prism) Prism.highlightAll();
