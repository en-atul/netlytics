import "./style.css";

const tocLinks = document.querySelectorAll<HTMLAnchorElement>(".on-this-page a[href^='#']");
const sections = document.querySelectorAll<HTMLElement>(".doc-section[id]");

function setActiveTocLink(id: string | null) {
  tocLinks.forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === `#${id}`);
  });
}

function updateActiveSection() {
  const viewportTop = window.scrollY + 120;
  let activeId: string | null = null;
  for (const section of sections) {
    const top = section.offsetTop;
    if (top <= viewportTop) activeId = section.id;
  }
  if (activeId) setActiveTocLink(activeId);
}

window.addEventListener("scroll", updateActiveSection, { passive: true });
updateActiveSection();

document.querySelector(".on-this-page-back")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
