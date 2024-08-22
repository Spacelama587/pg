document.addEventListener('DOMContentLoaded', function() {
    const teamWrapper = document.querySelector(".team-wrapper");
    const teamCarousel = document.querySelector(".team-carousel");
    const teamFirstCardWidth = teamCarousel.querySelector(".team-card").offsetWidth;
    const teamArrowBtns = document.querySelectorAll(".team-wrapper .team-arrow");
    const teamCarouselChildrens = [...teamCarousel.children];
  
    let teamIsDragging = false,
        teamIsAutoPlay = true,
        teamStartX,
        teamStartScrollLeft,
        teamTimeoutId;
  
    // Get the number of cards that can fit in the carousel at once
    let teamCardPerView = Math.round(teamCarousel.offsetWidth / teamFirstCardWidth);
  
    // Insert copies of the last few cards to beginning of carousel for infinite scrolling
    teamCarouselChildrens
      .slice(-teamCardPerView)
      .reverse()
      .forEach((card) => {
        teamCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
      });
  
    // Insert copies of the first few cards to end of carousel for infinite scrolling
    teamCarouselChildrens.slice(0, teamCardPerView).forEach((card) => {
      teamCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });
  
    // Scroll the carousel at appropriate position to hide first few duplicate cards on Firefox
    teamCarousel.classList.add("team-no-transition");
    teamCarousel.scrollLeft = teamCarousel.offsetWidth;
    teamCarousel.classList.remove("team-no-transition");
  
    // Add event listeners for the arrow buttons to scroll the carousel left and right
    teamArrowBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        teamCarousel.scrollLeft += btn.id === "team-left" ? -teamFirstCardWidth : teamFirstCardWidth;
      });
    });
  
    const teamDragStart = (e) => {
      teamIsDragging = true;
      teamCarousel.classList.add("team-dragging");
      // Records the initial cursor and scroll position of the carousel
      teamStartX = e.pageX;
      teamStartScrollLeft = teamCarousel.scrollLeft;
    };
  
    const teamDragging = (e) => {
      if (!teamIsDragging) return; // if teamIsDragging is false return from here
      // Updates the scroll position of the carousel based on the cursor movement
      teamCarousel.scrollLeft = teamStartScrollLeft - (e.pageX - teamStartX);
    };
  
    const teamDragStop = () => {
      teamIsDragging = false;
      teamCarousel.classList.remove("team-dragging");
    };
  
    const teamInfiniteScroll = () => {
      // If the carousel is at the beginning, scroll to the end
      if (teamCarousel.scrollLeft === 0) {
        teamCarousel.classList.add("team-no-transition");
        teamCarousel.scrollLeft = teamCarousel.scrollWidth - 2 * teamCarousel.offsetWidth;
        teamCarousel.classList.remove("team-no-transition");
      }
      // If the carousel is at the end, scroll to the beginning
      else if (
        Math.ceil(teamCarousel.scrollLeft) ===
        teamCarousel.scrollWidth - teamCarousel.offsetWidth
      ) {
        teamCarousel.classList.add("team-no-transition");
        teamCarousel.scrollLeft = teamCarousel.offsetWidth;
        teamCarousel.classList.remove("team-no-transition");
      }
      // Clear existing timeout & start autoplay if mouse is not hovering over carousel
      clearTimeout(teamTimeoutId);
      if (!teamWrapper.matches(":hover")) teamAutoPlay();
    };
  
    const teamAutoPlay = () => {
      if (window.innerWidth < 800 || !teamIsAutoPlay) return; // Return if window is smaller than 800 or teamIsAutoPlay is false
      // Autoplay the carousel after every 2500 ms
      teamTimeoutId = setTimeout(
        () => (teamCarousel.scrollLeft += teamFirstCardWidth),
        2500
      );
    };
  
    teamAutoPlay();
  
    teamCarousel.addEventListener("mousedown", teamDragStart);
    teamCarousel.addEventListener("mousemove", teamDragging);
    document.addEventListener("mouseup", teamDragStop);
    teamCarousel.addEventListener("scroll", teamInfiniteScroll);
    teamWrapper.addEventListener("mouseenter", () => clearTimeout(teamTimeoutId));
    teamWrapper.addEventListener("mouseleave", teamAutoPlay);
  });