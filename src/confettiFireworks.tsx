// utils/confettiFireworks.ts
import confetti from 'canvas-confetti';

export const launchFireworks = () => {
  const duration = 3 * 1000; // 3 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 500 * (timeLeft / duration);
    // Two random bursts from edges
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random(), y: Math.random() * 0.5 }
    });
  }, 250);
};
