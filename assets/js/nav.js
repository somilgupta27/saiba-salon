// Saiba Hair Salon & Spa — sticky nav / hamburger drawer toggle

  const btn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');

  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => drawer.classList.contains('open') ? closeMenu() : openMenu());
  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeMenu));
