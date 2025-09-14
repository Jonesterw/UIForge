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
    const particleCount = 40;
    const durationFrames = 90;

    for (let i = 0; i < particleCount; i++) {
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 4,
        color: `hsl(${Math.random() * 360}, 90%, 60%)`,
        vx: Math.cos(Math.random() * 2 * Math.PI) * Math.random() * 6,
        vy: Math.sin(Math.random() * 2 * Math.PI) * Math.random() * 6 - 2,
        alpha: 1,
      });
    }

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 1 / durationFrames; // fade out over the animation duration

        if (p.alpha > 0) {
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });

      frame++;
      if (frame < durationFrames) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        animationFrameId = null; // Animation finished
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
    // Stop propagation to prevent card's mouseleave event from firing immediately
    e.stopPropagation(); 
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
      searchInput.focus();
    }
  };
  
  // Also close if the mouse leaves the entire preview area
  const closeSearch = () => {
    searchBox.classList.remove('active');
  };

  searchBtn.addEventListener('click', toggleSearch);
  container.addEventListener('mouseleave', closeSearch);

  return () => {
    searchBtn.removeEventListener('click', toggleSearch);
    container.removeEventListener('mouseleave', closeSearch);
  };
}
window.initExpandingSearchBar = initExpandingSearchBar;

// Interactive Particle Network
function initInteractiveParticleNetwork(container) {
  const canvas = container.querySelector('.particle-network-canvas');
  const ctx = canvas.getContext('2d');
  if (!canvas) return;

  // Helper function to limit the rate at which a function gets called.
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  let animationFrameId;
  let particles = [];
  
  const mouse = {
    x: null,
    y: null,
  };

  class Particle {
    constructor(x, y, directionX, directionY, size) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = 'rgba(88, 166, 255, 0.8)'; // var(--primary-accent)
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
      if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function resizeCanvas() {
    // Set canvas size to match its container's display size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    initParticles();
  }
  
  // Debounce resize to avoid performance issues
  const debouncedResize = debounce(resizeCanvas, 100);
  // Use ResizeObserver for better performance and reliability
  const resizeObserver = new ResizeObserver(debouncedResize);
  resizeObserver.observe(container);

  // Initial resize
  resizeCanvas();

  // Mouse listeners
  const onMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };
  const onMouseOut = () => {
    mouse.x = null;
    mouse.y = null;
  };
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseout', onMouseOut);

  function initParticles() {
    particles = [];
    // Increase particle density
    let numberOfParticles = (canvas.height * canvas.width) / 3500;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 1.5) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * .4) - .2;
      let directionY = (Math.random() * .4) - .2;
      particles.push(new Particle(x, y, directionX, directionY, size));
    }
  }

  function connect() {
    const connectRadiusSq = Math.pow(Math.min(canvas.width, canvas.height) / 5, 2);
    const mouseConnectRadiusSq = Math.pow(Math.min(canvas.width, canvas.height) / 3.5, 2);

    // Connect particles to each other
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distanceSq = Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2);
        
        if (distanceSq < connectRadiusSq) {
          const opacityValue = 1 - (distanceSq / connectRadiusSq);
          ctx.strokeStyle = `rgba(140, 180, 255, ${opacityValue})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
    // Connect particles to mouse
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        let distanceSq = Math.pow(particles[i].x - mouse.x, 2) + Math.pow(particles[i].y - mouse.y, 2);
        
        if (distanceSq < mouseConnectRadiusSq) {
          const opacityValue = 1 - (distanceSq / mouseConnectRadiusSq);
          ctx.strokeStyle = `rgba(233, 117, 168, ${opacityValue})`; // var(--secondary-accent)
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
  }
  
  animate();

  return () => {
    cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseout', onMouseOut);
  };
}
window.initInteractiveParticleNetwork = initInteractiveParticleNetwork;
