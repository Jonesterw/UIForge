// Magnetic Hover Effect
function initMagneticHoverEffect(container) {
  const card = container.querySelector('.magnetic-card');
  if (!card) return;

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2; // Cursor X relative to center
    const y = e.clientY - rect.top - rect.height / 2; // Cursor Y relative to center

    // Increase translation strength for a more noticeable "magnetic" pull
    const translateX = x * 0.3;
    const translateY = y * 0.3;

    // Add a subtle 3D rotation for a more dynamic feel
    const rotateX = -y * 0.08; // Tilt up/down based on Y position
    const rotateY = x * 0.08;  // Tilt left/right based on X position

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
  }

  function onLeave() {
    card.style.transform = '';
  }

  // Attach listeners to the container (the preview area), not the card itself.
  // This makes the effect active within the entire preview area.
  container.addEventListener('mousemove', onMove);
  container.addEventListener('mouseleave', onLeave);

  return () => {
    container.removeEventListener('mousemove', onMove);
    container.removeEventListener('mouseleave', onLeave);
    card.style.transform = ''; // Ensure it resets on cleanup
  };
}
window.initMagneticHoverEffect = initMagneticHoverEffect;

// Confetti Burst Effect
function initConfettiBurstEffect(container) {
  const card = container.querySelector('.confetti-card');
  if (!card) return;
  const canvas = card.querySelector('.confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Theme-aligned colors from the site's palette
  const themeColors = ['#58a6ff', '#e975a8', '#c9d1d9', '#ffffff'];

  // Use ResizeObserver for performant and scoped resize handling
  const resize = () => {
    if (!card.isConnected) return;
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(card);
  resize(); // Initial size

  function burst() {
    // Cancel any ongoing animation from a previous click
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    const confetti = [];
    const particleCount = 50; // More particles for a richer effect
    const durationFrames = 120; // Longer lifetime for a more graceful fade

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 4 + 1;
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        // Rectangular "shard" shape
        w: Math.random() * 4 + 2,
        h: Math.random() * 10 + 4,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        rotation: Math.random() * 2 * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame = 0;
    function draw() {
      // Use a semi-transparent fill for a motion-blur trail effect
      ctx.fillStyle = 'rgba(13, 17, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        // No gravity, but add some drag to slow particles down
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.rotation += p.rotationSpeed;
        p.alpha -= 1 / durationFrames; // fade out over the animation duration

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          // Add a glow effect matching the particle color
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      // Reset shadow for the next frame's background fill
      ctx.shadowBlur = 0;

      frame++;
      if (frame < durationFrames) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        // Fully clear canvas at the end of the animation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = null;
      }
    }
    draw();
  }

  card.addEventListener('click', burst);

  // Return a cleanup function
  return () => {
    card.removeEventListener('click', burst);
    resizeObserver.disconnect();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      // Also clear the canvas on stop to prevent artifacts
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
}
window.initConfettiBurstEffect = initConfettiBurstEffect;

// Typewriter Text Effect
function initTypewriterTextEffect(container) {
  const text = 'Typewriter Animation!';
  const el = container.querySelector('.typewriter-text');
  if (!el) return;

  // Ensure the cursor blink animation is active when the effect starts.
  el.style.animation = '';

  let i = 0, timeoutId;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      timeoutId = setTimeout(type, 80);
    } else {
      // Typing is finished, so stop the blinking cursor animation.
      el.style.animation = 'none';
    }
  }
  type();
  // Return a cleanup function to be called on mouseleave
  return () => {
    clearTimeout(timeoutId);
    el.textContent = '';
    // Also reset the animation so the cursor blinks again immediately.
    el.style.animation = '';
  };
}
window.initTypewriterTextEffect = initTypewriterTextEffect;

// Expanding Search Bar
function initExpandingSearchBar(container) {
  const searchBox = container.querySelector('.search-box');
  const searchBtn = container.querySelector('.search-btn');
  const searchInput = container.querySelector('.search-input');
  if (!searchBox || !searchBtn || !searchInput) return;

  const toggleSearch = (e) => {
    e.stopPropagation();
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
      searchInput.focus();
    }
  };

  searchBtn.addEventListener('click', toggleSearch);

  return () => {
    searchBtn.removeEventListener('click', toggleSearch);
    // On cleanup, ensure the search box is closed.
    searchBox.classList.remove('active');
  };
}
window.initExpandingSearchBar = initExpandingSearchBar;

// This is the compiled JavaScript from the TypeScript source.
function initGlitchText(container) {
    const el = container.querySelector('.glitch-text');
    if (!el) return () => { };
    let glitchTimeout;
    const startGlitch = () => {
        if (!el.classList.contains('glitching')) {
            el.classList.add('glitching');
        }
        clearTimeout(glitchTimeout);
        glitchTimeout = window.setTimeout(() => {
            el.classList.remove('glitching');
        }, 1000 + Math.random() * 500);
    };
    container.addEventListener('mouseenter', startGlitch);
    return () => {
        container.removeEventListener('mouseenter', startGlitch);
        clearTimeout(glitchTimeout);
    };
}
window.initGlitchText = initGlitchText;
