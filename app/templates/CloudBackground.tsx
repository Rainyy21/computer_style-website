import { useEffect, useRef } from "react";
import type { Weather, WeatherCondition } from "./ts/useWeather";

interface Puff {
  dx: number;
  dy: number;
  r: number;
}

interface Cloud {
  x: number;
  y: number;
  speed: number;
  scale: number;
  alpha: number;
  puffs: Puff[];
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  len: number;
  drift: number;
}

interface Scene {
  sky: string[];
  cloudColor: string;
  cloudAlpha: [number, number]; // min, max
  minClouds: number;
  precipitation?: "rain" | "snow";
  drops: number;
  fog: number; // overlay opacity
  lightning: boolean;
  sun: boolean;
}

const CLEAR_SKY = ["#73C2FB", "#A1E3D8", "#FFE4B5", "#FFF8ED"]; // Maya Blue, Fresh Mint, Warm Sand, Sunlit Cream
const GREY_SKY = ["#7D8B99", "#A3AEB8", "#C5CCD3", "#DDE2E6"];
const STORM_SKY = ["#3E4652", "#5B6470", "#7A838E", "#959DA6"];

const SCENES: Record<WeatherCondition, Scene> = {
  clear:    { sky: CLEAR_SKY, cloudColor: "white", cloudAlpha: [0.2, 0.6], minClouds: 0, drops: 0, fog: 0, lightning: false, sun: true },
  cloudy:   { sky: ["#8DBCE0", "#AFD8D6", "#E8E0C8", "#F5F1E8"], cloudColor: "white", cloudAlpha: [0.4, 0.8], minClouds: 6, drops: 0, fog: 0, lightning: false, sun: false },
  overcast: { sky: GREY_SKY, cloudColor: "#EEF1F4", cloudAlpha: [0.5, 0.85], minClouds: 14, drops: 0, fog: 0, lightning: false, sun: false },
  fog:      { sky: ["#B8C2CA", "#CBD2D8", "#DCE1E5", "#EAEDEF"], cloudColor: "#F4F6F8", cloudAlpha: [0.3, 0.6], minClouds: 10, drops: 0, fog: 0.45, lightning: false, sun: false },
  drizzle:  { sky: GREY_SKY, cloudColor: "#D5DAE0", cloudAlpha: [0.5, 0.85], minClouds: 14, precipitation: "rain", drops: 90, fog: 0, lightning: false, sun: false },
  rain:     { sky: ["#5F6B78", "#808B96", "#A3ACB5", "#BCC3CA"], cloudColor: "#B4BBC4", cloudAlpha: [0.6, 0.9], minClouds: 18, precipitation: "rain", drops: 260, fog: 0, lightning: false, sun: false },
  snow:     { sky: ["#A9B8C8", "#C3CEDA", "#DAE2EA", "#EEF2F6"], cloudColor: "#F2F5F8", cloudAlpha: [0.5, 0.85], minClouds: 14, precipitation: "snow", drops: 160, fog: 0, lightning: false, sun: false },
  thunder:  { sky: STORM_SKY, cloudColor: "#80878F", cloudAlpha: [0.7, 0.95], minClouds: 20, precipitation: "rain", drops: 340, fog: 0, lightning: true, sun: false },
};

function cloudCountFor(weather: Weather | null, scene: Scene) {
  // More cloud cover → more clouds (2 when clear, up to 22 when fully covered)
  const fromCover = Math.round(2 + ((weather?.cloudCover ?? 20) / 100) * 20);
  return Math.max(scene.minClouds, fromCover);
}

function randomAlpha(scene: Scene) {
  const [min, max] = scene.cloudAlpha;
  return Math.random() * (max - min) + min;
}

function makeCloud(width: number, height: number, scene: Scene, x = Math.random() * width): Cloud {
  return {
    x,
    y: Math.random() * (height * 0.5 - 50), // Start in top half with buffer
    speed: Math.random() * 0.05 + 0.02, // Slower movement
    scale: Math.random() * 1.2 + 0.6,
    alpha: randomAlpha(scene),
    puffs: makePuffs(),
  };
}

function makePuffs(): Puff[] {
  const n = Math.floor(Math.random() * 4) + 3; // 3–6 puffs
  return Array.from({ length: n }, (_, i) => ({
    dx: i * 45 - (n * 45) / 2, // spread horizontally
    dy: Math.random() * 20 - 10, // slight vertical variation
    r: Math.random() * 30 + 25, // radius 25–55px
  }));
}

function makeDrop(width: number, height: number, type: "rain" | "snow", y = Math.random() * height): Drop {
  return type === "rain"
    ? { x: Math.random() * width, y, speed: Math.random() * 0.5 + 0.8, len: Math.random() * 10 + 10, drift: 0.15 }
    : { x: Math.random() * width, y, speed: Math.random() * 0.04 + 0.03, len: Math.random() * 2 + 1.5, drift: Math.random() * Math.PI * 2 };
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud, color: string) {
  ctx.save();
  ctx.translate(cloud.x, cloud.y);
  ctx.scale(cloud.scale, cloud.scale);
  ctx.globalAlpha = cloud.alpha;

  ctx.beginPath();
  for (const p of cloud.puffs) {
    ctx.moveTo(p.dx + p.r, p.dy);
    ctx.arc(p.dx, p.dy, p.r, 0, Math.PI * 2);
  }
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

interface CloudBackgroundProps {
  weather?: Weather | null;
}

export default function CloudBackground({ weather = null }: CloudBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weatherRef = useRef(weather);

  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let clouds: Cloud[] = [];
    let drops: Drop[] = [];
    let flash = 0; // lightning brightness, fades to 0
    let currentWeather: Weather | null | undefined;
    let scene = SCENES.clear;

    // Add or remove clouds/drops to match the current weather, without resetting the whole sky
    const syncScene = (reset: boolean) => {
      const w = weatherRef.current;
      if (!reset && w === currentWeather) return;
      const prevPrecipitation = scene.precipitation;
      currentWeather = w;
      scene = SCENES[w?.condition ?? "clear"];

      const targetClouds = cloudCountFor(w, scene);
      if (reset) clouds = [];
      while (clouds.length < targetClouds) clouds.push(makeCloud(canvas.width, canvas.height, scene));
      clouds.length = targetClouds;
      for (const c of clouds) c.alpha = randomAlpha(scene);

      if (reset || scene.precipitation !== prevPrecipitation) drops = [];
      if (scene.precipitation) {
        while (drops.length < scene.drops) drops.push(makeDrop(canvas.width, canvas.height, scene.precipitation));
      }
      drops.length = scene.drops;
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      syncScene(true);
    };

    const draw = (ts: number) => {
      const dt = Math.min(ts - lastTime, 100);
      lastTime = ts;
      syncScene(false);

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      scene.sky.forEach((color, i) => grad.addColorStop(i / (scene.sky.length - 1), color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Soft sun glow in the top-left corner
      if (scene.sun) {
        const sun = ctx.createRadialGradient(80, 80, 0, 80, 80, 260);
        sun.addColorStop(0, "rgba(255, 244, 200, 0.9)");
        sun.addColorStop(0.25, "rgba(255, 236, 170, 0.45)");
        sun.addColorStop(1, "rgba(255, 236, 170, 0)");
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, 400, 400);
      }

      for (const c of clouds) {
        // Move cloud to the right
        c.x += c.speed * dt;

        // Wrap around when fully off-screen right
        const maxRadius = Math.max(...c.puffs.map((p) => p.r));
        const cloudWidth = (c.puffs.length * 45 + maxRadius * 2) * c.scale;

        if (c.x - cloudWidth > canvas.width) {
          Object.assign(c, makeCloud(canvas.width, canvas.height, scene, -cloudWidth));
        }

        drawCloud(ctx, c, scene.cloudColor);
      }

      if (scene.precipitation === "rain") {
        ctx.strokeStyle = "rgba(220, 230, 240, 0.55)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const d of drops) {
          d.y += d.speed * dt;
          d.x += d.speed * d.drift * dt;
          if (d.y > canvas.height) Object.assign(d, makeDrop(canvas.width, canvas.height, "rain", -d.len));
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.len * d.drift, d.y + d.len);
        }
        ctx.stroke();
      } else if (scene.precipitation === "snow") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        for (const d of drops) {
          d.y += d.speed * dt;
          d.drift += 0.001 * dt;
          d.x += Math.sin(d.drift) * 0.3;
          if (d.y > canvas.height) Object.assign(d, makeDrop(canvas.width, canvas.height, "snow", -d.len));
          ctx.moveTo(d.x + d.len, d.y);
          ctx.arc(d.x, d.y, d.len, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      if (scene.fog > 0) {
        ctx.fillStyle = `rgba(240, 243, 246, ${scene.fog})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Occasional lightning flash
      if (scene.lightning) {
        if (flash <= 0 && Math.random() < dt / 8000) flash = 0.7;
        if (flash > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          flash -= dt / 300;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: -1, display: "block" }}
    />
  );
}
