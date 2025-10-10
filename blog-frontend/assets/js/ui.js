// UI helpers and animations
const ui = {
  qs: (s, r = document) => r.querySelector(s),
  qsa: (s, r = document) => Array.from(r.querySelectorAll(s)),
  appUrl(path) {
    const base =
      (window.__APP_CONFIG__ && window.__APP_CONFIG__.basePath) || '';
    const clean = (
      base.replace(/\/$/, '') +
      '/' +
      String(path || '').replace(/^\//, '')
    ).replace(/(?<!:)\/\/+/, '/');
    return clean || '/';
  },
  toast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, 2200);
  },
  img(url, fallback) {
    return url || fallback;
  },
};

// Simple fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 }
);
window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.reveal-once')
    .forEach((el) => observer.observe(el));
});
