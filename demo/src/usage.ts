import "./style.css";

const tabButtons = document.querySelectorAll<HTMLButtonElement>("[data-tab]");
const tabContents = document.querySelectorAll<HTMLElement>("[data-content]");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTab = btn.dataset.tab;
    if (!targetTab) return;

    // Remove active class from all buttons and contents
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    // Add active class to clicked button and corresponding content
    btn.classList.add("active");
    const content = document.querySelector(`[data-content="${targetTab}"]`);
    if (content) content.classList.add("active");
  });
});
