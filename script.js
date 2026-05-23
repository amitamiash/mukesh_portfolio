// ===== Smooth scroll for internal links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: 'smooth'
    });
  });
});

// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Close nav when clicking a link (mobile)
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Scroll progress bar & navbar highlight =====
const scrollBar = document.getElementById('scroll-bar');
const sections = document.querySelectorAll('[id]');
const navAnchors = document.querySelectorAll('[data-nav-section]');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollBar) scrollBar.style.width = `${progress}%`;

  let currentId = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) currentId = section.id;
  });
  navAnchors.forEach(a => {
    const hrefId = a.getAttribute('href').slice(1);
    a.classList.toggle('active', hrefId === currentId);
  });
});

// ===== Back to top button =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 600);
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Animated counters =====
const counterEls = document.querySelectorAll('[data-counter]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.counter || '0');
        let current = 0;
        const duration = 1000;
        const startTime = performance.now();

        function animateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = Math.floor(target * progress);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(animateCounter);
        }
        requestAnimationFrame(animateCounter);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );
  counterEls.forEach(el => counterObserver.observe(el));
}

// ===== Reveal animations on scroll =====
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach(el => revealObserver.observe(el));
}

// ===== Archive accordion =====
function toggleFolder(buttonEl) {
  const item = buttonEl.closest('.archive-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.archive-item.open').forEach(openItem => {
    if (openItem !== item) openItem.classList.remove('open');
  });
  item.classList.toggle('open', !isOpen);
}
window.toggleFolder = toggleFolder;

// ===== Work cards & hero reel -> open YouTube =====
function openYouTubeById(id) {
  if (!id) return;
  const url = `https://www.youtube.com/watch?v=${id}`;
  window.open(url, '_blank');
}

document.querySelectorAll('[data-youtube]').forEach(btn => {
  btn.addEventListener('click', e => {
    const id = btn.dataset.youtube;
    if (!id) return;
    openYouTubeById(id);
    e.stopPropagation();
  });
});

document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.youtube;
    if (!id) return;
    openYouTubeById(id);
  });
});

// ===== Canvas particles background =====
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;
  const PARTICLE_COUNT = 90;
  const particles = [];

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.4 + 0.6;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.cyan = Math.random() > 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const base = this.cyan ? '56,189,248' : '34,197,94';
      ctx.fillStyle = `rgba(${base},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = 0.06 * (1 - dist / maxDist);
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(render);
  }
  render();
}