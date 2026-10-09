import confetti from 'canvas-confetti';

export const CONFETTI_COLORS = ['#ED2E38', '#FFFFFF', '#8775A4', '#C9BCE0', '#FF6B73'];

const base = { colors: CONFETTI_COLORS, disableForReducedMotion: true, zIndex: 60 };

// Two cannons from the bottom corners.
export function cannons() {
  const shared = { ...base, particleCount: 90, spread: 70, startVelocity: 62, ticks: 260, scalar: 1.05 };
  confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.95 } });
  confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.95 } });
}

// A short salute: cannons first, then bursts across the top of the screen.
export function salute(duration = 1800) {
  cannons();
  const end = Date.now() + duration;
  const timer = setInterval(() => {
    if (Date.now() > end) return clearInterval(timer);
    confetti({
      ...base,
      particleCount: 45,
      spread: 360,
      startVelocity: 28,
      ticks: 200,
      gravity: 0.9,
      origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.3 }
    });
  }, 260);
}
