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
    ".section-title, .section-subtitle, .service-card, .project-card, .product-card, .contact-item, .leadership-title, .team-title, .leader-card, .team-card"
  );
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate");
    }
  });
}

class Carousel {
  constructor(trackId, prevBtnId, nextBtnId, dotsId) {
    this.track = document.getElementById(trackId);
    this.prevBtn = document.getElementById(prevBtnId);
    this.nextBtn = document.getElementById(nextBtnId);
    this.dotsContainer = document.getElementById(dotsId);
    this.cards = this.track ? this.track.children : [];
    this.currentIndex = 0;
    this.cardsToShow = this.getCardsToShow();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);

    if (this.track) {
      this.init();
    }
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

    setTimeout(() => {
      Array.from(this.cards).forEach((card, index) => {
        setTimeout(() => card.classList.add("animate"), index * 100);
      });
    }, 500);
  }

  createDots() {
    if (!this.dotsContainer) return;
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
    if (!this.track || this.cards.length === 0) return;
    const cardWidth = this.cards[0].offsetWidth + 24;
    const translateX = -this.currentIndex * cardWidth;
    this.track.style.transform = `translateX(${translateX}px)`;

    if (this.dotsContainer) {
      const dots = this.dotsContainer.children;
      Array.from(dots).forEach((dot, index) => {
        dot.classList.toggle(
          "active",
          index === Math.floor(this.currentIndex / this.cardsToShow)
        );
      });
    }

    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateCarousel();
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex = Math.min(this.currentIndex + this.cardsToShow, this.maxIndex);
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
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.next());
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.prev());

    if (this.track) {
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
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > dy) {
          e.preventDefault();
        }
      });

      this.track.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? this.next() : this.prev();
        }
      });
    }
  }

  resize() {
    this.cardsToShow = this.getCardsToShow();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    this.createDots();
    this.updateCarousel();
  }
}

class TeamCarousel {
  constructor() {
    this.track = document.getElementById("team-track");
    this.prevBtn = document.getElementById("team-prev");
    this.nextBtn = document.getElementById("team-next");
    this.dotsContainer = document.getElementById("team-dots");
    this.cards = this.track ? this.track.children : [];
    this.currentIndex = 0;
    this.cardsToShow = this.getCardsToShow();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
    this.autoPlayInterval = null;
    this.autoPlayDelay = 4000;

    if (this.track) {
      this.init();
    }
  }

  getCardsToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  }

  init() {
    this.createDots();
    this.updateCarousel();
    this.bindEvents();
    this.startAutoPlay();
    this.animateCards();
  }

  animateCards() {
    setTimeout(() => {
      Array.from(this.cards).forEach((card, index) => {
        setTimeout(() => card.classList.add("animate"), index * 100);
      });
    }, 500);
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = "";
    const dotsCount = Math.ceil(this.cards.length / this.cardsToShow);
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add("team-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToSlide(i * this.cardsToShow));
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    if (!this.track || this.cards.length === 0) return;
    const cardWidth = this.cards[0].offsetWidth + 24;
    const translateX = -this.currentIndex * cardWidth;
    this.track.style.transform = `translateX(${translateX}px)`;

    if (this.dotsContainer) {
      const dots = this.dotsContainer.children;
      Array.from(dots).forEach((dot, index) => {
        dot.classList.toggle(
          "active",
          index === Math.floor(this.currentIndex / this.cardsToShow)
        );
      });
    }

    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    this.updateVisibleCards();
  }

  updateVisibleCards() {
    Array.from(this.cards).forEach((card, index) => {
      const isVisible =
        index >= this.currentIndex &&
        index < this.currentIndex + this.cardsToShow;
      card.style.transform = isVisible ? "scale(1)" : "scale(0.95)";
      card.style.opacity = isVisible ? "1" : "0.7";
    });
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateCarousel();
    this.restartAutoPlay();
  }

  next() {
    this.currentIndex = this.currentIndex >= this.maxIndex ? 0 :
      Math.min(this.currentIndex + this.cardsToShow, this.maxIndex);
    this.updateCarousel();
    this.restartAutoPlay();
  }

  prev() {
    this.currentIndex = this.currentIndex <= 0 ? this.maxIndex :
      Math.max(this.currentIndex - this.cardsToShow, 0);
    this.updateCarousel();
    this.restartAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = null;
  }

  restartAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  bindEvents() {
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.next());
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.prev());
    if (this.track) {
      this.track.addEventListener("mouseenter", () => this.stopAutoPlay());
      this.track.addEventListener("mouseleave", () => this.startAutoPlay());
    }
    this.addTouchSupport();
    this.addKeyboardSupport();
  }

  addTouchSupport() {
    if (!this.track) return;
    let startX = 0, startY = 0, isDragging = false;
    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      this.stopAutoPlay();
    });
    this.track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > dy) e.preventDefault();
    });
    this.track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
      this.startAutoPlay();
    });
  }

  addKeyboardSupport() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
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

let servicesCarousel, projectsCarousel, productsCarousel, teamCarousel;
function initCarousels() {
  servicesCarousel = new Carousel("services-track", "services-prev", "services-next", "services-dots");
  projectsCarousel = new Carousel("projects-track", "projects-prev", "projects-next", "projects-dots");
  productsCarousel = new Carousel("products-track", "products-prev", "products-next", "products-dots");
  teamCarousel = new TeamCarousel();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function handleParallax() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) hero.style.transform = `translateY(${scrolled * -0.3}px)`;
}

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
  if (teamCarousel) teamCarousel.resize();
});

document.addEventListener("DOMContentLoaded", () => {
  initCarousels();
  handleScrollAnimations();

  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement("span");
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
      setTimeout(() => ripple.remove(), 600);
    });
  }
});

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
