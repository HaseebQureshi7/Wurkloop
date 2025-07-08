// Scroll Progress Bar
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-progress").style.width = scrollPercent + "%";
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Scroll animations
function handleScrollAnimations() {
  const elements = document.querySelectorAll(
    ".section-title, .section-subtitle, .service-card, .project-card, .product-card, .contact-item"
  );

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate");
    }
  });
}

// Carousel functionality
class Carousel {
  constructor(trackId, prevBtnId, nextBtnId, dotsId) {
    this.track = document.getElementById(trackId);
    this.prevBtn = document.getElementById(prevBtnId);
    this.nextBtn = document.getElementById(nextBtnId);
    this.dotsContainer = document.getElementById(dotsId);
    this.cards = this.track.children;
    this.currentIndex = 0;
    this.cardsToShow = this.getCardsToShow();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);

    this.init();
  }

  getCardsToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  init() {
    this.createDots();
    this.updateCarousel();
    this.bindEvents();

    // Auto-animate cards when they come into view
    setTimeout(() => {
      Array.from(this.cards).forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("animate");
        }, index * 100);
      });
    }, 500);
  }

  createDots() {
    this.dotsContainer.innerHTML = "";
    const dotsCount = Math.ceil(this.cards.length / this.cardsToShow);

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToSlide(i * this.cardsToShow));
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    const cardWidth = this.cards[0].offsetWidth + 24; // 24px gap
    const translateX = -this.currentIndex * cardWidth;
    this.track.style.transform = `translateX(${translateX}px)`;

    // Update dots
    const dots = this.dotsContainer.children;
    Array.from(dots).forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === Math.floor(this.currentIndex / this.cardsToShow)
      );
    });

    // Update button states
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateCarousel();
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex = Math.min(
        this.currentIndex + this.cardsToShow,
        this.maxIndex
      );
      this.updateCarousel();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(this.currentIndex - this.cardsToShow, 0);
      this.updateCarousel();
    }
  }

  bindEvents() {
    this.nextBtn.addEventListener("click", () => this.next());
    this.prevBtn.addEventListener("click", () => this.prev());

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    this.track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = Math.abs(currentX - startX);
      const dy = Math.abs(currentY - startY);

      if (dx > dy) {
        // Horizontal swipe: block vertical scroll
        e.preventDefault();
      }
    });

    this.track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }

  resize() {
    this.cardsToShow = this.getCardsToShow();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    this.createDots();
    this.updateCarousel();
  }
}

// Initialize carousels
let servicesCarousel, projectsCarousel, productsCarousel;

function initCarousels() {
  servicesCarousel = new Carousel(
    "services-track",
    "services-prev",
    "services-next",
    "services-dots"
  );
  projectsCarousel = new Carousel(
    "projects-track",
    "projects-prev",
    "projects-next",
    "projects-dots"
  );
  productsCarousel = new Carousel(
    "products-track",
    "products-prev",
    "products-next",
    "products-dots"
  );
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Parallax effect for hero section
function handleParallax() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const rate = scrolled * -0.3;

  if (hero) {
    hero.style.transform = `translateY(${rate}px)`;
  }
}

// Event listeners
window.addEventListener("scroll", () => {
  updateScrollProgress();
  handleNavbarScroll();
  handleScrollAnimations();
  handleParallax();
});

window.addEventListener("resize", () => {
  if (servicesCarousel) servicesCarousel.resize();
  if (projectsCarousel) projectsCarousel.resize();
  if (productsCarousel) productsCarousel.resize();
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initCarousels();
  handleScrollAnimations();

  // Add ripple effect to CTA button
  const ctaButton = document.querySelector(".cta-button");
  ctaButton.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                `;

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
