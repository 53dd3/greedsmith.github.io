/* =============================================
   main.js — Portfolio IA & Automatisation
   Art Direction: Dark Digital Interface
   Animations : cursor, particles, scroll progress rail, navbar
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. CUSTOM CURSOR
  -------------------------------------------------- */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Expand ring on interactive elements
  document.querySelectorAll('a, button, [role="button"], input, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'rgba(0, 217, 255, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '28px';
      ring.style.height = '28px';
      ring.style.borderColor = 'rgba(240, 240, 240, 0.35)';
    });
  });

  /* --------------------------------------------------
     2. NAVBAR — scroll state + hamburger
  -------------------------------------------------- */
  const header     = document.querySelector('header');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------
     3. BACKGROUND CANVAS — Particules sur tout le site
     (Algorithme et interactions conservés intégralement)
  -------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PARTICLE_COUNT = 90;
    const CONNECT_DIST   = 140;
    // Teinte cyan technique accordée à la palette #00D9FF
    const DOT_COLOR  = '0, 217, 255';
    const LINE_COLOR = '0, 185, 225';

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * W;
        this.y     = Math.random() * H;
        this.vx    = (Math.random() - 0.5) * 0.4;
        this.vy    = (Math.random() - 0.5) * 0.4;
        this.r     = Math.random() * 1.8 + 0.8;
        this.alpha = Math.random() * 0.4 + 0.55;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        // Halo de lueur discret autour du point
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `rgba(${DOT_COLOR}, 0.6)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DOT_COLOR}, ${this.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow pour les lignes
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    // Répulsion souris (sur tout le document)
    let mx = -9999, my = -9999;
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });
    document.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        const dx   = p.x - mx;
        const dy   = p.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          p.vx += dx / dist * 0.08;
          p.vy += dy / dist * 0.08;
          const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
          if (speed > 1.5) { p.vx = p.vx/speed * 1.5; p.vy = p.vy/speed * 1.5; }
        }
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* --------------------------------------------------
     4. VERTICAL PROGRESS RULER (ArtCraft Style)
     Indicateur latéral avec repères et pourcentage réel (000% à 100%)
  -------------------------------------------------- */
  const pctDisplay    = document.getElementById('scroll-pct');
  const railIndicator = document.querySelector('.rail-indicator');
  const railBar       = document.querySelector('.rail-progress-bar');
  const railSection   = document.getElementById('rail-section');
  const mobileFill    = document.querySelector('.mobile-progress-fill');
  const sections      = document.querySelectorAll('section[id], section[data-section-name]');

  let ticking = false;
  function updateProgress() {
    const docElem   = document.documentElement;
    const scrollTop = window.scrollY || docElem.scrollTop || 0;
    const maxScroll = (docElem.scrollHeight - window.innerHeight);
    const percent   = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)) : 0;
    const rounded   = Math.round(percent);
    const padded    = String(rounded).padStart(3, '0');

    if (pctDisplay) {
      pctDisplay.textContent = padded;
    }
    if (railIndicator) {
      railIndicator.style.top = `${percent}%`;
    }
    if (railBar) {
      railBar.style.height = `${percent}%`;
    }
    if (mobileFill) {
      mobileFill.style.width = `${percent}%`;
    }

    // Détection de section courante pour repère ArtCraft
    if (railSection && sections.length > 0) {
      let currentSection = '';
      const viewMiddle = scrollTop + window.innerHeight * 0.35;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (viewMiddle >= top && viewMiddle < top + height) {
          currentSection = sec.getAttribute('data-section-name') || sec.id.toUpperCase();
        }
      });
      if (!currentSection && sections[0]) {
        currentSection = sections[0].getAttribute('data-section-name') || 'OVERVIEW';
      }
      if (currentSection) {
        railSection.textContent = currentSection;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  // Init au chargement
  updateProgress();

  /* --------------------------------------------------
     5. SCROLL REVEAL — IntersectionObserver
  -------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.project-cell, .content-cell, .stat-cell, .contact-cell, .gta-step-row, .project-card, .content-card, .stat-item, .gta-step'
  );

  if (revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------
     6. AUDIO TOGGLE (Abyssal Dream Records)
  -------------------------------------------------- */
  const audioToggle = document.querySelector('.audio-toggle');
  const video       = document.querySelector('.video-container video');

  if (audioToggle && video) {
    audioToggle.addEventListener('click', () => {
      video.muted = !video.muted;
      audioToggle.textContent = video.muted ? '🔇 Activer le son' : '🔊 Désactiver le son';
      audioToggle.setAttribute('aria-pressed', !video.muted);
    });
  }

  /* --------------------------------------------------
     7. DISCRETE 2D HOVER FEEDBACK ON CARDS
     (Angles droits 2D, pas de tilt 3D ni distorsion artificielle)
  -------------------------------------------------- */
  document.querySelectorAll('.project-card, .content-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('card-hovered');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('card-hovered');
    });
  });

});
