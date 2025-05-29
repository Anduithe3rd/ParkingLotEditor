function setView(view) {
  const container = document.getElementById('lot-container');
  const map = {
    outline: 'ParkingLotOutline.png',
    grid: 'ParkingLotWithGridAndBackground.png',
    topo: 'TopographicBackground.png'
  };
  container.style.backgroundImage = `url('${map[view]}')`;
}

// Enable dragging for positioning
document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.car-box');
  boxes.forEach(box => {
    makeDraggable(box);
  });
});

function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    el.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const container = document.getElementById('lot-container');
      const rect = container.getBoundingClientRect();
      const newLeft = e.clientX - rect.left - offsetX;
      const newTop = e.clientY - rect.top - offsetY;
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      el.style.zIndex = '';
      console.log(
        `<div class="car-box" contenteditable style="top: ${el.style.top}; left: ${el.style.left}; transform: ${el.style.transform};">${el.innerText}</div>`
      );
    }
  });
}
