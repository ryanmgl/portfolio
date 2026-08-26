const menu = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const links = [...document.querySelectorAll('.sidebar nav a')];

menu.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
  menu.textContent = open ? '×' : '☰';
});

links.forEach(link => link.addEventListener('click', () => {
  sidebar.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = '☰';
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-42% 0px -52% 0px' });
document.querySelectorAll('main section').forEach(section => observer.observe(section));
