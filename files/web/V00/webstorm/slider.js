'use strict';
const slides = [
  {
    "src": "assets/slide-1.svg",
    "caption": "Керамика — начало"
  },
  {
    "src": "assets/slide-2.svg",
    "caption": "Керамика — практика"
  },
  {
    "src": "assets/slide-3.svg",
    "caption": "Керамика — мастерская"
  },
  {
    "src": "assets/slide-4.svg",
    "caption": "Керамика — проект"
  }
];
let index = 0;
let interval;
function show() {
    document.getElementById('slide').src = slides[index].src;
    document.getElementById('slide').alt = slides[index].caption;
    document.getElementById('caption').textContent = slides[index].caption;
    document.getElementById('position').textContent = (index + 1) + ' / ' + slides.length;
}
function move(direction) {
    index = (index + direction + slides.length) % slides.length;
    show();
}
function restart() {
    clearInterval(interval);
    interval = setInterval(() => move(1), 3000);
}
document.getElementById('prev').addEventListener('click', () => { move(-1); restart(); });
document.getElementById('next').addEventListener('click', () => { move(1); restart(); });
show();
restart();
