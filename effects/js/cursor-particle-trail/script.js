// Interactive Particle Trail (Canvas Implementation)
function initParticleTrail(container) {
  const canvas = container.querySelector('#particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  let mouse = { x: -999, y: -999 }; // Start off-screen
  let particles = [];
  let animationFrameId;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  resizeCanvas();

  // --- Particle System ---
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`; // Bluish-cyan tones
      this.life = 50; // Shorter lifespan
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= 1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life / 50;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  function handleParticles() {
    // Add new particles only if mouse is inside the container
    if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life < 0) {
        particles.splice(i, 1);
      }
    }
  }

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }
  
  function onMouseLeave() {
    // Stop creating particles when mouse leaves
    mouse.x = -999;
    mouse.y = -999;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  // --- Event Listeners & Cleanup ---
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', resizeCanvas);
  animate();

  function destroy() {
    cancelAnimationFrame(animationFrameId);
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('resize', resizeCanvas);
  }

  return destroy;
}

// Expose to global scope for embed-controller
(function(global){
  global.initParticleTrail = initParticleTrail;
})(window);
