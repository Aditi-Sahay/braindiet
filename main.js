// =============================================
//   BRAIN DIET — main.js
//   Aditi Sahay · 2025
// =============================================

// === CUSTOM CURSOR ===
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.className = 'cursor';
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth cursor follow
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor states
const hoverTargets = document.querySelectorAll('a, button, .cal-cell, .curr-card, .essay-card, .tag, .curr-item');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// === NAV SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// === MOBILE NAV ===
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('nav ul');
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// === SCROLL REVEAL ===
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// === CALENDAR CELL CLICK — show topic tooltip ===
const calCells = document.querySelectorAll('.cal-cell');
calCells.forEach(cell => {
  cell.addEventListener('click', () => {
    const topic = cell.querySelector('.cal-topic')?.textContent;
    const month = cell.querySelector('.cal-month')?.textContent;
    showToast(`${month}: ${topic}`);
  });
});

// === TOAST NOTIFICATION ===
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// === SCRAMBLE TEXT EFFECT on hero title ===
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

function scramble(el, finalText, duration = 800) {
  let frame = 0;
  const totalFrames = Math.floor(duration / 30);
  const interval = setInterval(() => {
    el.textContent = finalText.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (frame / totalFrames > i / finalText.length) return char;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame >= totalFrames) {
      el.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
}

// Run scramble on the eyebrow text after a short delay
window.addEventListener('load', () => {
  const eyebrow = document.querySelector('.eyebrow');
  if (eyebrow) {
    const original = eyebrow.textContent.trim();
    setTimeout(() => scramble(eyebrow, original, 900), 300);
  }
});

// === PROGRESS BAR on scroll ===
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  progressBar.style.width = pct + '%';
});

// === ESSAY CARDS — link to substack ===
document.querySelectorAll('.essay-card').forEach(card => {
  card.addEventListener('click', () => {
    window.open('https://substack.com/@aditiisahay', '_blank');
  });
});

// === MONTH COUNTER ANIMATION ===
function animateNumber(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(interval);
  }, 16);
}

// Trigger number animations when currently-section is visible
const currentlySection = document.querySelector('.currently-section');
if (currentlySection) {
  const countObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // animate follower count
      const followerEl = document.querySelector('.curr-item-val.count-animate');
      if (followerEl) animateNumber(followerEl, 324);
      countObserver.disconnect();
    }
  }, { threshold: 0.3 });
  countObserver.observe(currentlySection);
}

// === TAG HOVER — subtle ripple ===
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-2px)';
  });
  tag.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
  });
});

// === KEYBOARD NAV hint (easter egg) ===
let konamiBuffer = [];
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => {
  konamiBuffer.push(e.key);
  konamiBuffer = konamiBuffer.slice(-10);
  if (konamiBuffer.join(',') === konami.join(',')) {
    showToast('🧠 You found the easter egg. Smart.');
    document.body.style.filter = 'hue-rotate(120deg)';
    setTimeout(() => document.body.style.filter = '', 2000);
  }
});

// === ACTIVE NAV LINK on scroll ===
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('nav-active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('nav-active');
    }
  });
});
