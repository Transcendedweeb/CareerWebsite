(() => {
  const bgCanvas = document.getElementById('background-canvas');
  const ctx = bgCanvas.getContext('2d');

  let width, height;
  function resize() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  resize();

  const lines = [];
  const lineCount = 50;

  for (let i = 0; i < lineCount; i++) {
    lines.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.2 + Math.random() * 0.3,
      length: 200 + Math.random() * 100,
      opacity: 0.05 + Math.random() * 0.05,
      angle: Math.PI / 4
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let line of lines) {
        const dx = Math.cos(line.angle) * line.length;
        const dy = Math.sin(line.angle) * line.length;

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + dx, line.y + dy);
        ctx.strokeStyle = `rgba(60, 60, 60, ${line.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;

        if (line.x > width || line.y > height) {
            const spawnFromTop = Math.random() > 0.5;
            if (spawnFromTop) {
                line.x = Math.random() * width;
                line.y = -50;
            } else {
                line.x = -50;
                line.y = Math.random() * height;
            }
        }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
