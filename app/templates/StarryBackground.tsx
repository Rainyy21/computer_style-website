import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  state: string;
  elapsed: number;
  alpha: number;
  fadeInDur: number;
  onDur: number;
  fadeOutDur: number;
  offDur: number;
}

function makeStar(width: number, height: number, rmax: number): Star {
  const states = ["off", "fadein", "on", "fadeout"];
  const state = states[Math.floor(Math.random() * states.length)];
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * (rmax - 0.5) + 0.5,
    state,
    elapsed: Math.random() * 1000,
    alpha: state === "on" ? 1 : 0,
    fadeInDur: Math.random() * 400 + 200,
    onDur: Math.random() * 1500 + 500,
    fadeOutDur: Math.random() * 400 + 200,
    offDur: Math.random() * 2000 + 500,
  };
}

function updateStar(s: Star, dt: number) {
  s.elapsed += dt;

  if (s.state === "off") {
    s.alpha = 0;
    if (s.elapsed >= s.offDur) {
      s.state = "fadein";
      s.elapsed = 0;
    }
  } else if (s.state === "fadein") {
    s.alpha = Math.min(s.elapsed / s.fadeInDur, 1);
    if (s.elapsed >= s.fadeInDur) {
      s.state = "on";
      s.elapsed = 0;
      s.alpha = 1;
    }
  } else if (s.state === "on") {
    s.alpha = 1;
    if (s.elapsed >= s.onDur) {
      s.state = "fadeout";
      s.elapsed = 0;
    }
  } else if (s.state === "fadeout") {
    s.alpha = Math.max(1 - s.elapsed / s.fadeOutDur, 0);
    if (s.elapsed >= s.fadeOutDur) {
      s.state = "off";
      s.elapsed = 0;
      // re-randomize durations for variety next cycle
      s.fadeInDur = Math.random() * 400 + 200;
      s.onDur = Math.random() * 1500 + 500;
      s.fadeOutDur = Math.random() * 400 + 200;
      s.offDur = Math.random() * 2000 + 500;
    }
  }
}

interface StarryBackgroundProps {
  count?: number;
  rmax?: number;
}

export default function StarryBackground({
  count = 200,
  rmax = 2,
}: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let stars: Star[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: count }, () =>
        makeStar(canvas.width, canvas.height, rmax)
      );
    };

    const draw = (ts: number) => {
      const dt = Math.min(ts - lastTime, 100);
      lastTime = ts;

      // Deep space gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#0B0E14"); // Void black
      grad.addColorStop(0.3, "#0F1931"); // Midnight blue
      grad.addColorStop(0.6, "#1A2A4E"); // Deep navy
      grad.addColorStop(1, "#2E1A47"); // Deep purple
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        updateStar(s, dt);
        if (s.alpha <= 0) continue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    init();
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [count, rmax]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        display: "block",
      }}
    />
  );
}
