// Detect if device supports touch (tablet/phone)
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  const bgCanvas = document.getElementById('networkCursor');
  const ctx = bgCanvas.getContext('2d');

  function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  let mouse = { x: bgCanvas.width / 2, y: bgCanvas.height / 2, moving: false, lastMove: Date.now() };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moving = true;
    mouse.lastMove = Date.now();
  });

  const NODE_COUNT = 8;
  const nodes = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      angle: Math.random() * 2 * Math.PI,
      radius: 50 + Math.random() * 50,
      speed: 0.001 + Math.random() * 0.003,
      x: mouse.x,
      y: mouse.y
    });
  }

  function animate() {
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    const now = Date.now();
    const active = mouse.moving || now - mouse.lastMove < 500;

    const positions = [];

    nodes.forEach(n => {
      if (active) {
        n.angle += n.speed;
      }
      const targetX = mouse.x + Math.cos(n.angle) * n.radius;
      const targetY = mouse.y + Math.sin(n.angle) * n.radius;

      n.x += (targetX - n.x) * 0.05;
      n.y += (targetY - n.y) * 0.05;

      positions.push({ x: n.x, y: n.y });
    });

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i];
        const p2 = positions[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(0,0,0,0.07)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    positions.forEach(p => {
      const gradient = ctx.createLinearGradient(mouse.x, mouse.y, p.x, p.y);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.05)');

      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    positions.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fill();

    requestAnimationFrame(animate);
  }

  animate();
}
