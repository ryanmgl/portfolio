const menu = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const links = [...document.querySelectorAll('.sidebar nav a')];

menu.addEventListener('click', () => {
  const mobile = window.matchMedia('(max-width: 800px)').matches;
  const open = mobile
    ? sidebar.classList.toggle('open')
    : !document.body.classList.toggle('menu-collapsed');
  menu.setAttribute('aria-expanded', open);
  menu.textContent = open ? '×' : '☰';
  menu.setAttribute('aria-label', open ? 'Hide navigation' : 'Show navigation');
});

links.forEach(link => link.addEventListener('click', () => {
  if (window.matchMedia('(max-width: 800px)').matches) {
    sidebar.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
    menu.setAttribute('aria-label', 'Show navigation');
  }
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-42% 0px -52% 0px' });
document.querySelectorAll('main section').forEach(section => observer.observe(section));

const resumeModal = document.querySelector('#resume-modal');
const resumeOpen = document.querySelector('#resume-open');
const resumeClose = resumeModal.querySelector('.resume-close');

const showResume = () => {
  resumeModal.classList.add('open');
  resumeModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('resume-open');
  resumeClose.focus();
};

const hideResume = () => {
  resumeModal.classList.remove('open');
  resumeModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('resume-open');
  resumeOpen.focus();
};

resumeOpen.addEventListener('click', showResume);
resumeClose.addEventListener('click', hideResume);
resumeModal.addEventListener('click', event => {
  if (event.target === resumeModal) hideResume();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && resumeModal.classList.contains('open')) hideResume();
});

// A blended liquid field that makes the page itself feel responsive to the cursor.
const fluid = document.querySelector('.fluid-trail');
const canUseFluid = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUseFluid) {
  let previous = null;
  let dismiss;
  window.addEventListener('pointermove', event => {
    const speed = previous ? Math.hypot(event.clientX - previous.x, event.clientY - previous.y) : 0;
    previous = { x: event.clientX, y: event.clientY };
    fluid.style.setProperty('--fluid-x', `${event.clientX}px`);
    fluid.style.setProperty('--fluid-y', `${event.clientY}px`);
    fluid.style.setProperty('--fluid-scale', (0.82 + Math.min(speed, 55) / 170).toFixed(2));
    fluid.classList.add('active');
    clearTimeout(dismiss);
    dismiss = setTimeout(() => fluid.classList.remove('active'), 520);
  }, { passive: true });
  document.addEventListener('mouseleave', () => fluid.classList.remove('active'));
}

// One-time, scroll-triggered entrances. These begin after the hero and never
// bind animation progress to the scroll position, keeping scrolling responsive.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealGroups = [
    ['#about .section-label', 'fade'],
    ['#about .split-heading h2', 'left'],
    ['#about .split-heading > p', 'right'],
    ['#about .about-actions', 'fade'],
    ['#about .education', 'up'],
    ['#experience .section-label, #experience h2', 'fade'],
    ['#experience .timeline-card', 'alternate'],
    ['#skills .section-label', 'fade'],
    ['#skills .skills-title h2', 'left'],
    ['#skills .skills-title > p', 'right'],
    ['#skills .skill-group', 'up'],
    ['#skills .certs', 'fade'],
    ['#projects .section-label', 'fade'],
    ['#projects .projects-heading h2', 'left'],
    ['#projects .projects-heading > p', 'right'],
    ['#projects .project-card', 'alternate'],
    ['#contact .section-label, #contact .availability, #contact h2, #contact .email, #contact .contact-footer', 'up']
  ];

  const revealItems = [];

  revealGroups.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      const resolvedDirection = direction === 'alternate'
        ? (index % 2 === 0 ? 'left' : 'right')
        : direction;

      element.classList.add('scroll-reveal', `reveal-${resolvedDirection}`);
      element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 90}ms`);
      revealItems.push(element);
    });
  });

  document.documentElement.classList.add('reveal-ready');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);

      const finishReveal = event => {
        const finishingProperty = entry.target.classList.contains('reveal-fade') ? 'opacity' : 'transform';
        if (event.propertyName !== finishingProperty) return;
        entry.target.removeEventListener('transitionend', finishReveal);
        entry.target.classList.remove('scroll-reveal', 'reveal-fade', 'reveal-left', 'reveal-right', 'reveal-up', 'is-visible');
        entry.target.style.removeProperty('--reveal-delay');
      };
      entry.target.addEventListener('transitionend', finishReveal);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));
}
