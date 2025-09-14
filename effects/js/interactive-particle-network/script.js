window.initParticleNetwork = function(container) {
    const canvas = container.querySelector('#particle-canvas');
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let animationFrameId = null;

    let particles = [];
    let mouse = { x: undefined, y: undefined };

    const resizeHandler = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initParticles();
    };

    const mouseMoveHandler = (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    };

    const mouseLeaveHandler = () => {
        mouse.x = undefined;
        mouse.y = undefined;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = '#58a6ff';
        }
        update() {
            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = (width * height) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (width/7) * (height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = 'rgba(88,166,255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        animationFrameId = requestAnimationFrame(animate);
    }

    function start() {
        window.addEventListener('resize', resizeHandler);
        canvas.addEventListener('mousemove', mouseMoveHandler);
        canvas.addEventListener('mouseleave', mouseLeaveHandler);
        initParticles();
        animate();
    }

    function destroy() {
        window.removeEventListener('resize', resizeHandler);
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        canvas.removeEventListener('mouseleave', mouseLeaveHandler);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        ctx.clearRect(0, 0, width, height);
        particles = [];
    }

    // Start the animation
    start();

    // Return the destroy function for the embed-controller
    return destroy;
};