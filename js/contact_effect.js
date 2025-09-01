document.addEventListener('DOMContentLoaded', () => {
  const texts = document.querySelectorAll('.contact-info p');

  texts.forEach(p => {
    const nodes = Array.from(p.childNodes);
    p.innerHTML = '';

    function typeNode(node, parent, callback) {
      if (node.nodeType === Node.TEXT_NODE) {
        let i = 0;
        function typeChar() {
          if (i < node.textContent.length) {
            parent.appendChild(document.createTextNode(node.textContent.charAt(i)));
            i++;
            setTimeout(typeChar, 40);
          } else {
            callback();
          }
        }
        typeChar();
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        parent.appendChild(clone);
        let children = Array.from(node.childNodes);
        function typeChild(index = 0) {
          if (index < children.length) {
            typeNode(children[index], clone, () => typeChild(index + 1));
          } else {
            callback();
          }
        }
        typeChild();
      }
    }

    function typeNodes(index = 0) {
      if (index < nodes.length) {
        typeNode(nodes[index], p, () => typeNodes(index + 1));
      }
    }

    typeNodes();
  });

  const canvas = document.getElementById('spriteOverlay');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = '#ffffffff'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const sprite = new Image();
  sprite.src = 'src/masks/sprite-center.png';
  const totalFrames = 46;
  const frameWidth = 71236 / 46; 
  const frameHeight = 870;
  let currentFrame = 0;

  const spriteSpeed = 20;
  let lastTime = 0;

  function animateSprite(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta > spriteSpeed) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(
        sprite,
        currentFrame * frameWidth, 0, frameWidth, frameHeight,
        0, 0, canvas.width, canvas.height
      );
      ctx.globalCompositeOperation = 'source-over';

      currentFrame++;
      lastTime = timestamp;
    }

    if (currentFrame < totalFrames) {
      requestAnimationFrame(animateSprite);
    } else {
      canvas.style.display = 'none';
      document.body.classList.remove('force-hidden');
    }
  }

  sprite.onload = () => {
    requestAnimationFrame(animateSprite);
  };

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
});
