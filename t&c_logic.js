// Scroll Progress Bar
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-progress").style.width = scrollPercent + "%";
}

// Scroll animations for sections
function handleScrollAnimations() {
  const sections = document.querySelectorAll(".terms-section");

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionVisible = 150;

    if (sectionTop < window.innerHeight - sectionVisible) {
      section.classList.add("animate");
    }
  });
}

// Smooth scrolling for TOC links
document.querySelectorAll(".toc-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const offsetTop =
        targetElement.getBoundingClientRect().top + window.pageYOffset - 120;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Event listeners
window.addEventListener("scroll", () => {
  updateScrollProgress();
  handleScrollAnimations();
});

// Initialize animations on load
document.addEventListener("DOMContentLoaded", () => {
  handleScrollAnimations();
});

// Add active state to TOC based on scroll position
function updateTOCActive() {
  const sections = document.querySelectorAll(".terms-section");
  const tocLinks = document.querySelectorAll(".toc-link");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 200) {
      currentSection = section.id;
    }
  });

  tocLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateTOCActive);

// Add CSS for active TOC link
const style = document.createElement("style");
style.textContent = `
            .toc-link.active {
                background: rgba(139, 92, 246, 0.15);
                color: #8b5cf6;
                transform: translateX(5px);
            }
            
            .toc-link.active .toc-number {
                background: #8b5cf6;
                color: white;
            }
        `;
document.head.appendChild(style);
