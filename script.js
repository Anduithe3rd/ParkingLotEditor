function setView(view) {
  const container = document.getElementById('lot-container');
  const map = {
    outline: 'ParkingLotOutline.png',
    grid: 'ParkingLotWithGridAndBackground.png',
    topo: 'TopographicBackground.png'
  };
  container.style.backgroundImage = `url('${map[view]}')`;
}

window.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.car-box');
  boxes.forEach(box => {
    makeDraggable(box);
    makeRotatable(box);
  });
});

function makeDraggable(el) {
  if (movementLocked) return;
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  el.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('rotate-handle')) return; // dont drag if rotating
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = 1000;
  });

  el.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const container = document.getElementById('lot-container');
      const rect = container.getBoundingClientRect();
      const newLeft = e.clientX - rect.left - offsetX;
      const newTop = e.clientY - rect.top - offsetY;
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    }
  });

  el.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      el.releasePointerCapture(e.pointerId);
      el.style.zIndex = '';
      logBox(el);
    }
  });
}

function makeRotatable(el) {
  const handle = el.querySelector('.rotate-handle');
  if (!handle) return;

  let isRotating = false;
  let centerX, centerY;

  handle.addEventListener('pointerdown', (e) => {
    if (movementLocked) return;
    isRotating = true;
    const rect = el.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    e.preventDefault();
    e.stopPropagation();
    handle.setPointerCapture(e.pointerId);
  });

  handle.addEventListener('pointermove', (e) => {
    if (!isRotating) return;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    el.style.transform = `rotate(${angle}deg)`;
  });

  handle.addEventListener('pointerup', (e) => {
    if (!isRotating) return;
    isRotating = false;
    handle.releasePointerCapture(e.pointerId);
    logBox(el);
  });
}


function getRotationAngle(el) {
  const transform = el.style.transform;
  const match = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
  return match ? parseFloat(match[1]) : 0;
}

function logBox(el) {
  console.log(
    `<div class="car-box" style="top: ${el.style.top}; left: ${el.style.left}; transform: ${el.style.transform};">${el.innerText}<div class="rotate-handle"></div></div>`
  );
}

function downloadCanvas() {
  const container = document.getElementById('lot-container');
  html2canvas(container, {
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'parking-lot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

let movementLocked = true;

function toggleLock() {
  movementLocked = !movementLocked;
  const text = movementLocked ? "Move Textboxes: OFF" : "Move Textboxes: ON";
  document.getElementById("toggle-lock").innerText = text;
  document.getElementById("lot-container").classList.toggle("locked", movementLocked);
}
