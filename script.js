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
