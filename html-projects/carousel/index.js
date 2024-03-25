const PREV_BTN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<title>arrow-left-drop-circle-outline</title>
<path
  d="M22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12M14,7L9,12L14,17V7Z"
/>
</svg>`;
const NEXT_BTN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<title>arrow-right-drop-circle-outline</title>
<path
  d="M2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12M4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12M10,17L15,12L10,7V17Z"
/>
</svg>`;

class Carousel {
  constructor({
    el,
    imagePaths,
    showPrevBtn = true,
    showNextBtn = true,
    showNavigators = true,
    loop = true,
    autoPlay = false,
    autoPlayTimeout = 3000,
  }) {
    this.carouselContainer = document.querySelector(el);
    this.imagePaths = imagePaths;
    this.showNavigators = showNavigators;
    this.loop = loop;
    this.autoPlay = autoPlay;
    this.autoPlayTimeout = autoPlayTimeout;

    const slideList = document.createElement("div");
    slideList.classList.add("slide-list");
    this.slideList = slideList;
    this.carouselContainer.appendChild(slideList);

    if (showNavigators) {
      const navContainer = document.createElement("div");
      navContainer.classList.add("nav-container");
      this.navContainer = navContainer;
      this.carouselContainer.appendChild(navContainer);
      // navContainer.addEventListener("click", this.navContainerOnclick.bind(this));
    }

    if (showPrevBtn) {
      const prevBtn = document.createElement("button");
      prevBtn.classList.add("prevBtn");
      prevBtn.innerHTML = PREV_BTN_SVG;
      prevBtn.addEventListener("click", this.prevSlide.bind(this));
      this.prevBtn = prevBtn;
      this.carouselContainer.appendChild(prevBtn);
    }

    if (showNextBtn) {
      const nextBtn = document.createElement("button");
      nextBtn.classList.add("nextBtn");
      nextBtn.innerHTML = NEXT_BTN_SVG;
      nextBtn.addEventListener("click", this.nextSlide.bind(this));
      this.nextBtn = nextBtn;
      this.carouselContainer.appendChild(nextBtn);
    }

    this.currentIndex = -1;
    this.#init();
    if (this.loop) {
      this.#loopInit();
    }

    this.showSlide(0);

    if (this.autoPlay) {
      this.autoPlayTimer = setInterval(this.nextSlide.bind(this), this.autoPlayTimeout);
    }
  }

  #init() {
    const initSlideWidth = () => {
      const width = document.documentElement.clientWidth;
      this.slideList.style.setProperty("--slide-width", `${width}px`);
    };
    const createSlides = () => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.count; i++) {
        const slide = document.createElement("div");
        slide.classList.add("slide");
        const img = document.createElement("img");
        img.src = this.imagePaths[i];
        img.alt = this.imagePaths[i];
        slide.appendChild(img);
        fragment.appendChild(slide);
      }
      this.slideList.appendChild(fragment);
    };

    const createNavigators = () => {
      if (!this.showNavigators) {
        return;
      }
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.count; i++) {
        const navItem = document.createElement("div");
        navItem.classList.add("nav-item");
        // navItem.dataset.index = i;
        navItem.addEventListener("click", () => {
          this.showSlide(i);
        });
        fragment.appendChild(navItem);
      }
      this.navContainer.appendChild(fragment);
    };

    createNavigators();
    initSlideWidth();
    createSlides();
  }

  #loopInit() {
    this.slideList.classList.add("is-loop");
    const firstCloned = this.slideList.firstElementChild.cloneNode(true);
    const lastCloned = this.slideList.lastElementChild.cloneNode(true);
    firstCloned.classList.add("duplicated");
    lastCloned.classList.add("duplicated");
    this.slideList.appendChild(firstCloned);
    this.slideList.insertBefore(lastCloned, this.slideList.firstElementChild);
  }

  get navItems() {
    return [...document.querySelectorAll(".nav-item")];
  }
  get slides() {
    return [...document.querySelectorAll(".slide:not(.duplicated)")];
  }

  get count() {
    return this.imagePaths.length;
  }

  showSlide(n) {
    if (n === this.currentIndex) {
      return;
    }

    const slides = this.slides;
    // console.log("slides :>> ", slides);
    this.currentIndex = (n + slides.length) % slides.length;

    if (this.showNavigators) {
      const navItems = this.navItems;
      for (let i = 0; i < navItems.length; i++) {
        //   slides[i].dataset.active = false;
        navItems[i].classList.remove("active");
      }
      // console.log("this.currentIndex :>> ", this.currentIndex);
      navItems[this.currentIndex].classList.add("active");
    }

    this.slideList.style.transform = `translateX(-${this.currentIndex}00%)`;
    this.slideList.style.transition = ".5s";
  }

  nextSlide() {
    if (this.currentIndex === this.count - 1) {
      if (!this.loop) return;
      // 無縫切換
      this.slideList.style.transition = "none";
      this.slideList.style.transform = "translateX(100%)";

      document.documentElement.clientHeight;
      this.showSlide(0);
    } else {
      this.showSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex === 0) {
      if (!this.loop) return;
      // 無縫切換
      this.slideList.style.transition = "none";
      this.slideList.style.transform = `translateX(-${this.count}00%)`;

      document.documentElement.clientHeight;
      this.showSlide(this.count - 1);
    } else {
      this.showSlide(this.currentIndex - 1);
    }
  }

  // navContainerOnclick(e) {
  //   function findNavItem(el) {
  //     if (!el) return null;
  //     if (el.matches(".nav-item")) {
  //       return el;
  //     }
  //     return findNavItem(el.parent);
  //   }
  //   const el = findNavItem(e.target);
  //   if (!el) return;

  //   this.showSlide(Number(el.dataset.index));
  // }
}

const carousel = new Carousel({
  el: ".carousel-container",
  imagePaths: Array.from({ length: 6 }).map((_, i) => `./imgs/${i + 1}.jpg`),
  // showNavigators: false,
  // loop: false,
  // showNextBtn: false,
  // showPrevBtn: false,
  // autoPlay: true,
});
