document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const audioToggle = document.querySelector('.audio-toggle');
  const video = document.querySelector('.video-container video');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeToggle) themeToggle.textContent = '🌙 Sombre';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeToggle.textContent = isLight ? '🌙 Sombre' : '☀️ Clair';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  if (audioToggle && video) {
    audioToggle.addEventListener('click', () => {
      video.muted = !video.muted;
      audioToggle.textContent = video.muted ? '🔇 Activer le son' : '🔊 Désactiver le son';
    });
  }
});
