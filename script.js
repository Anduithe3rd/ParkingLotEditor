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
  });
});

function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  el.addEventListener('pointerdown', (e) => {
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
      console.log(
        `<div class="car-box" contenteditable style="top: ${el.style.top}; left: ${el.style.left}; transform: ${el.style.transform};">${el.innerText}</div>`
      );
    }
  });
}
