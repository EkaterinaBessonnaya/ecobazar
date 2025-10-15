"use strict";

window.addEventListener("load", windowLoad);

let isMobile;

function windowLoad() {
  isMobile = window.navigator.userAgentData.mobile;

  isMobile ? document.body.setAttribute("data-touch", "") : null;

  document.addEventListener("click", documentAction);

  const coundown = document.querySelectorAll("[data-countdown]");
  const parallaxItems = document.querySelectorAll('[data-parallax]');

  if (coundown.length) {
    initCoundown(coundown);
  }

  if (parallaxItems.length) {
    parallaxInit(parallaxItems)
  }

  dynamicAdaptHeader();
  sliderInit();
}

function dynamicAdaptHeader() {
  const topHeader = document.querySelector(".top-header");
  const header = document.querySelector(".header");
  const menu = document.querySelector(".menu");
  const phoneHeader = document.querySelector(".bottom-header__phone");
  const searchHeader = document.querySelector(".search-header");

  const bottomContainer = document.querySelector(".bottom-header__container");
  const actionHeader = document.querySelector(".actions-header");
  const placeSearch = document.querySelector(".middle-header__place-search");

  if (header) {
    const media = window.matchMedia("(max-width: 767.98px)");

    media.addEventListener("change", (e) => {
      dynamicAdaptHeaderInit(media);
    });

    dynamicAdaptHeaderInit(media);
  }

  function dynamicAdaptHeaderInit(media) {
    if (media.matches) {
      bottomContainer.insertAdjacentElement("beforeend", searchHeader);
      actionHeader.insertAdjacentElement("beforeend", phoneHeader);
      menu.insertAdjacentElement("beforeend", topHeader);
    } else {
      bottomContainer.insertAdjacentElement("beforeend", phoneHeader);
      placeSearch.insertAdjacentElement("beforeend", searchHeader);
      header.insertAdjacentElement("afterbegin", topHeader);
    }

    searchHeader.classList.toggle("--dynamic", media.matches);
    phoneHeader.classList.toggle("--dynamic", media.matches);
  }
}

function documentAction(e) {
  const targetElement = e.target;

  if (isMobile) {
    if (targetElement.closest(".menu__button")) {
      const subMenu = targetElement.closest(".menu__button").nextElementSibling;

      if (subMenu) {
        subMenu.closest(".menu__item").classList.toggle("--active");
      }
    } else {
      const menuItemActive = document.querySelectorAll(".menu__item.--active");

      if (menuItemActive.length) {
        menuItemActive.forEach((menuItemActiveItem) => {
          menuItemActiveItem.classList.remove("--active");
        });
      }
    }
  }

  if (targetElement.closest(".icon-menu")) {
    document.body.classList.toggle("scroll-lock");
    document.documentElement.classList.toggle("open-menu");
  }

  if (targetElement.closest(".add-to-card")) {
    const button = targetElement.closest(".add-to-card");
    const productItem = button.closest(".item-product");
    const productImage = productItem.querySelector(".item-product__image");
    const cardHeader = document.querySelector(".card-header__icon-bag span");

    flyImage(productImage, cardHeader);
  }
}

function flyImage(productImage, cardHeader) {
  const flyImg = document.createElement("img");
  const speed = 2000;

  flyImg.src = productImage.src;
  flyImg.style.cssText = `
    position: absolute;
    transition-duration: ${speed}ms;
    z-index: 50;
    width: ${productImage.offsetWidth}px;
    left: ${productImage.getBoundingClientRect().left + scrollX}px;
    top: ${productImage.getBoundingClientRect().top + scrollY}px;
  `;

  document.body.insertAdjacentElement("beforeend", flyImg);

  flyImg.style.left = `${cardHeader.getBoundingClientRect().left + scrollX}px`;
  flyImg.style.top = `${cardHeader.getBoundingClientRect().top + scrollY}px`;
  flyImg.style.width = `10px`;
  // flyImg.style.opacity = `0.3`;

  setTimeout(() => {
    flyImg.remove();
    cardHeader.innerHTML = +cardHeader.innerHTML + 1;
  }, speed);
}

function initCoundown(coundown) {
  coundown.forEach((coundownItem) => {
    initCountdownItem(coundownItem);
  });
}

function initCountdownItem(countdownItem) {
  const goalTime = countdownItem.dataset.countdown;

  if (goalTime) {
    const countdownItemSpans = countdownItem.querySelectorAll(
      ".countdown__digits span"
    );
    const timeGoal = Date.parse(goalTime);

    let timer = setInterval(() => {
      let timerLeft = timeGoal - Date.now();

      if (timerLeft >= 0) {
        const MSECONDS_PER_DAY = 1000 * 60 * 60 * 24;
        const MSECONDS_PER_HOUR = 1000 * 60 * 60;
        const MSECONDS_PER_MIN = 1000 * 60;
        const MSECONDS_PER_SEC = 1000;

        const days = Math.floor(timerLeft / MSECONDS_PER_DAY);
        const hours = Math.floor(
          (timerLeft % MSECONDS_PER_DAY) / MSECONDS_PER_HOUR
        );
        const minutes = Math.floor(
          (timerLeft % MSECONDS_PER_HOUR) / MSECONDS_PER_MIN
        );
        const second = Math.floor(
          (timerLeft % MSECONDS_PER_MIN) / MSECONDS_PER_SEC
        );

        countdownItemSpans[0].innerHTML = String(days).padStart(2, "0");
        countdownItemSpans[1].innerHTML = String(hours).padStart(2, "0");
        countdownItemSpans[2].innerHTML = String(minutes).padStart(2, "0");
        countdownItemSpans[3].innerHTML = String(second).padStart(2, "0");
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }
}

function sliderInit() {
  if (document.querySelector(".slider-reviews")) {
    const sliderReviews = new Swiper(".slider-reviews", {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 24,

      // Navigation arrows
      navigation: {
        nextEl: ".block-header__slider-arrow--right",
        prevEl: ".block-header__slider-arrow--left",
      },

      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10,
        },
        600: {
          slidesPerView: 1.5,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1050: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }
}

function parallaxInit(parallaxItems) {
	window.addEventListener("scroll", windowScroll);

	function windowScroll() {
		const currentItems = document.querySelectorAll(".parallax");

    if (currentItems.length) {
      currentItems.forEach(currentItem => {
        const parallaxItem = currentItem.querySelector('[data-parallax-item]');

        if (parallaxItem) {
          const windowHeight = window.innerHeight + currentItem.offsetHeight;
          const currentItemHeight = currentItem.offsetHeight;
          const topPosition = currentItem.getBoundingClientRect().top + currentItemHeight;
          const way = (topPosition / (windowHeight / 2) * 100) - 100;
          const difference = (currentItemHeight - parallaxItem.offsetHeight) / parallaxItem.offsetHeight * way;

          parallaxItem.style.cssText = `translate: 0 ${difference}% `;
        }
      })
    }
	}

	const options = {
		root: null,
		rootMargin: "0px",
		threshold: 0,
	}

	const callback = (entries, observer) => {
		entries.forEach(entry => {
			const currentElement = entry.target;

			if (entry.isIntersecting) {
				currentElement.classList.add('parallax');
				console.log("I see you");
			} else {
				currentElement.classList.remove('parallax');
				console.log("I don't see you!")
			}
		});
	};

	const observer = new IntersectionObserver(callback, options);

	parallaxItems.forEach(parallaxItem => {
		observer.observe(parallaxItem);
	})
}
