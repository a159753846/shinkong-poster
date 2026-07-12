const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 70;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2.2 + 0.3;
    // drifting slow upward and sideways
    this.speedY = Math.random() * -0.5 - 0.15;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
    this.pulseSpeed = Math.random() * 0.005 + 0.002;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    // Pulse opacity for twinkling effect
    this.opacity += this.pulseSpeed * this.pulseDirection;
    if (this.opacity > 0.6) {
      this.pulseDirection = -1;
    } else if (this.opacity < 0.1) {
      this.pulseDirection = 1;
    }

    // Reset if it drifts off the top
    if (this.y < -10) {
      this.y = canvas.height + 10;
      this.x = Math.random() * canvas.width;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    // Reset if off sides
    if (this.x < -10 || this.x > canvas.width + 10) {
      this.speedX = -this.speedX;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // golden color rgb(212, 175, 55)
    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
    
    // Add subtle glow to slightly larger particles
    if (this.radius > 1.2) {
      ctx.shadowBlur = this.radius * 3;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  // Clear with a tiny bit of trail to make particles feel smoother
  ctx.fillStyle = 'rgba(8, 9, 12, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw a subtle radial vignette gradient in the background to blend perfectly
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 50, 
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
  );
  gradient.addColorStop(0, 'rgba(22, 25, 33, 0.05)');
  gradient.addColorStop(0.5, 'rgba(8, 9, 12, 0.2)');
  gradient.addColorStop(1, 'rgba(4, 5, 6, 0.7)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  ctx.shadowBlur = 0; // reset default shadow
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  
  requestAnimationFrame(animate);
}

init();
animate();
