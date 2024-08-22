document.addEventListener("DOMContentLoaded", () => {

const sdWrapper = document.querySelector(".sd-wrapper");
const sdCarousel = document.querySelector(".sd-carousel");
const sdFirstCardWidth = sdCarousel.querySelector(".sd-card");
const sdArrowBtns = document.querySelectorAll(".sd-wrapper .sd-arrow");
const sdCarouselChildrens = [...sdCarousel.children];

let sdIsDragging = false,
    sdIsAutoPlay = true,
    sdStartX,
    sdStartScrollLeft,
    sdTimeoutId;


let sdCardPerView = Math.round(sdCarousel.offsetWidth / sdFirstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
sdCarouselChildrens
  .slice(-sdCardPerView)
  .reverse()
  .forEach((card) => {
    sdCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });


sdCarouselChildrens.slice(0, sdCardPerView).forEach((card) => {
  sdCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});


sdCarousel.classList.add("sd-no-transition");
sdCarousel.scrollLeft = sdCarousel.offsetWidth;
sdCarousel.classList.remove("sd-no-transition");


sdArrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sdCarousel.scrollLeft += btn.id === "sd-left" ? -sdFirstCardWidth : sdFirstCardWidth;
  });
});

const sdDragStart = (e) => {
  sdIsDragging = true;
  sdCarousel.classList.add("sd-dragging");

  sdStartX = e.pageX;
  sdStartScrollLeft = sdCarousel.scrollLeft;
};

const sdDragging = (e) => {
  if (!sdIsDragging) return; 
  sdCarousel.scrollLeft = sdStartScrollLeft - (e.pageX - sdStartX);
};

const sdDragStop = () => {
  sdIsDragging = false;
  sdCarousel.classList.remove("sd-dragging");
};

const sdInfiniteScroll = () => {

  if (sdCarousel.scrollLeft === 0) {
    sdCarousel.classList.add("sd-no-transition");
    sdCarousel.scrollLeft = sdCarousel.scrollWidth - 2 * sdCarousel.offsetWidth;
    sdCarousel.classList.remove("sd-no-transition");
  }

  else if (
    Math.ceil(sdCarousel.scrollLeft) ===
    sdCarousel.scrollWidth - sdCarousel.offsetWidth
  ) {
    sdCarousel.classList.add("sd-no-transition");
    sdCarousel.scrollLeft = sdCarousel.offsetWidth;
    sdCarousel.classList.remove("sd-no-transition");
  }

  clearTimeout(sdTimeoutId);
  if (!sdWrapper.matches(":hover")) sdAutoPlay();
};

const sdAutoPlay = () => {
  if (window.innerWidth < 800 || !sdIsAutoPlay) return; // Return if window is smaller than 800 or sdIsAutoPlay is false
  sdTimeoutId = setTimeout(
    () => (sdCarousel.scrollLeft += sdFirstCardWidth),
    2500
  );
};

sdAutoPlay();

sdCarousel.addEventListener("mousedown", sdDragStart);
sdCarousel.addEventListener("mousemove", sdDragging);
document.addEventListener("mouseup", sdDragStop);
sdCarousel.addEventListener("scroll", sdInfiniteScroll);
sdWrapper.addEventListener("mouseenter", () => clearTimeout(sdTimeoutId));
sdWrapper.addEventListener("mouseleave", sdAutoPlay);

});