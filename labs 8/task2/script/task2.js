const slides = [
  {
    title: 'Гірський маршрут',
    text: 'Слайдер підтримує плавний рух, зациклення та керування клавіатурою.',
    background: 'linear-gradient(135deg, #335c67 0%, #c6d8d3 48%, #f4a261 100%)',
  },
  {
    title: 'Міський вечір',
    text: 'Autoplay зупиняється, коли курсор знаходиться над слайдом.',
    background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 44%, #e63946 100%)',
  },
  {
    title: 'Творча студія',
    text: 'Параметри можна змінювати без перезавантаження сторінки.',
    background: 'linear-gradient(135deg, #264653 0%, #2a9d8f 46%, #e9c46a 100%)',
  },
  {
    title: 'Зелений парк',
    text: 'Крапки пагінації дозволяють перейти до будь-якого слайду.',
    background: 'linear-gradient(135deg, #386641 0%, #6a994e 45%, #bc4749 100%)',
  },
];

const controls = {
  root: document.querySelector('#gallerySlider'),
  autoplay: document.querySelector('#autoplayToggle'),
  arrows: document.querySelector('#arrowsToggle'),
  dots: document.querySelector('#dotsToggle'),
  duration: document.querySelector('#durationInput'),
  apply: document.querySelector('#applyConfig'),
};

function createSlider(container, options) {
  const state = {
    index: 0,
    intervalId: null,
    paused: false,
    options: {
      slides: [],
      duration: 500,
      autoplay: true,
      autoplayDelay: 2400,
      arrows: true,
      dots: true,
      ...options,
    },
  };

  function render() {
    container.innerHTML = `
      <div class="slider-track"></div>
      ${state.options.arrows ? '<button class="slider-arrow prev" type="button" aria-label="Попередній слайд">‹</button><button class="slider-arrow next" type="button" aria-label="Наступний слайд">›</button>' : ''}
      ${state.options.dots ? '<div class="slider-dots" aria-label="Пагінація слайдера"></div>' : ''}
    `;

    const track = container.querySelector('.slider-track');
    track.style.transitionDuration = `${state.options.duration}ms`;
    track.innerHTML = state.options.slides.map((slide) => `
      <article class="slide" style="--slide-bg: ${slide.background}">
        <div>
          <h2>${slide.title}</h2>
          <p>${slide.text}</p>
        </div>
      </article>
    `).join('');

    renderDots();
    bindControls();
    update();
    restartAutoplay();
  }

  function renderDots() {
    const dots = container.querySelector('.slider-dots');

    if (!dots) {
      return;
    }

    dots.innerHTML = state.options.slides.map((_, index) => (
      `<button class="slider-dot" type="button" data-index="${index}" aria-label="Слайд ${index + 1}"></button>`
    )).join('');
  }

  function bindControls() {
    container.querySelector('.prev')?.addEventListener('click', () => move(-1));
    container.querySelector('.next')?.addEventListener('click', () => move(1));
    container.querySelector('.slider-dots')?.addEventListener('click', (event) => {
      const dot = event.target.closest('.slider-dot');

      if (dot) {
        goTo(Number(dot.dataset.index));
      }
    });
  }

  function update() {
    const track = container.querySelector('.slider-track');
    track.style.transform = `translateX(-${state.index * 100}%)`;

    container.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === state.index);
    });
  }

  function goTo(index) {
    const total = state.options.slides.length;
    state.index = (index + total) % total;
    update();
    restartAutoplay();
  }

  function move(direction) {
    goTo(state.index + direction);
  }

  function startAutoplay() {
    stopAutoplay();

    if (!state.options.autoplay || state.paused) {
      return;
    }

    state.intervalId = setInterval(() => move(1), state.options.autoplayDelay);
  }

  function stopAutoplay() {
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function setOptions(nextOptions) {
    state.options = { ...state.options, ...nextOptions };
    state.index = Math.min(state.index, state.options.slides.length - 1);
    render();
  }

  container.addEventListener('mouseenter', () => {
    state.paused = true;
    stopAutoplay();
  });

  container.addEventListener('mouseleave', () => {
    state.paused = false;
    startAutoplay();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      move(-1);
    }

    if (event.key === 'ArrowRight') {
      move(1);
    }
  });

  render();

  return { setOptions };
}

const slider = createSlider(controls.root, { slides });

controls.apply.addEventListener('click', () => {
  slider.setOptions({
    duration: Number(controls.duration.value) || 520,
    autoplay: controls.autoplay.checked,
    arrows: controls.arrows.checked,
    dots: controls.dots.checked,
  });
});
