import { progressAt } from "./engine.mjs";
export function receiverEdge(receiver, target) {
  const dx = target.x - receiver.x,
    dy = target.y - receiver.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.001) return null;
  return {
    x: receiver.x + (dx / distance) * receiver.r,
    y: receiver.y + (dy / distance) * receiver.r,
    angle: Math.atan2(dy, dx),
  };
}
export function receiverCurve(receiver, target) {
  const dx = target.x - receiver.x;
  const dy = target.y - receiver.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= receiver.r) return null;
  const edge = receiverEdge(receiver, target);
  if (!edge) return null;
  const bend = Math.min((distance - receiver.r) * 0.22, 48);
  // Keep the control point outside the tangent at the circle edge.
  // The whole quadratic then stays outside the receiver without folding back.
  return {
    edge,
    control: {
      x: (edge.x + target.x) / 2 - (dy / distance) * bend,
      y: (edge.y + target.y) / 2 + (dx / distance) * bend,
    },
  };
}
export function positionOf(s, elapsed, width, height, level) {
  const p = progressAt(s, elapsed),
    r = width < 600 ? 26 : 32;
  const ySlots = [0.17, 0.3, 0.43, 0.61, 0.75, 0.88];
  const wide = level.wide ? 1 : 0.84,
    travel = (width - 2 * r - 24) * wide,
    base = (width - travel) / 2;
  let x = base + (s.side === 1 ? p : 1 - p) * travel;
  let y = 70 + (height - 170) * ySlots[s.lane];
  if (level.scan) {
    const centers = level.scan === "three" ? [0.19, 0.5, 0.81] : [0.22, 0.5, 0.78];
    x = width * centers[s.zone] + Math.sin(p * Math.PI) * Math.min(width * 0.06, 45) * s.side;
    y = 90 + (height - 200) * (0.22 + ((s.lane % 3) / 2) * 0.57);
  } else y += Math.sin(p * Math.PI * 2 + s.phase) * Math.min(8, height * 0.012);
  return {
    x: Math.max(r + 8, Math.min(width - r - 8, x)),
    y: Math.max(100, Math.min(height - 110, y)),
    r,
  };
}
const HIT_RING = "#95e6b5";
const CREAM = "#fff6dc";
// Particles are drawn from cached sprites so bursts stay cheap on phones.
const sprites = new Map();
function sprite(kind, color) {
  const key = kind + color;
  if (sprites.has(key)) return sprites.get(key);
  const size = 64,
    canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const c = canvas.getContext("2d"),
    m = size / 2;
  const glow = c.createRadialGradient(m, m, 0, m, m, m);
  glow.addColorStop(0, color + "aa");
  glow.addColorStop(0.35, color + "33");
  glow.addColorStop(1, color + "00");
  c.fillStyle = glow;
  c.fillRect(0, 0, size, size);
  c.fillStyle = color;
  c.beginPath();
  if (kind === "sparkle") {
    const r = m * 0.9,
      w = r * 0.14;
    c.moveTo(m, m - r);
    c.quadraticCurveTo(m + w, m - w, m + r, m);
    c.quadraticCurveTo(m + w, m + w, m, m + r);
    c.quadraticCurveTo(m - w, m + w, m - r, m);
    c.quadraticCurveTo(m - w, m - w, m, m - r);
  } else {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        r = i % 2 ? m * 0.26 : m * 0.62;
      c.lineTo(m + Math.cos(a) * r, m + Math.sin(a) * r);
    }
  }
  c.closePath();
  c.fill();
  sprites.set(key, canvas);
  return canvas;
}
export class WorldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = innerWidth;
    this.height = innerHeight;
    this.fx = [];
    this.t = 0;
    this.reduced = false;
    this.screen = "home";
    this.level = null;
    this.receiver = null;
    this.nextShootingStar = 4;
    this.points = Array.from({ length: 70 }, (_, i) => ({
      x: ((i * 7919) % 997) / 997,
      y: ((i * 3571) % 991) / 991,
      size: i % 9 === 0 ? 9 : i % 4 === 0 ? 5 : 2.4,
      phase: i * 1.3,
      speed: 0.35 + ((i * 37) % 11) / 20,
      drift: ((i * 13) % 7) - 3,
    }));
    this.resize();
  }
  resize() {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    const d = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = this.width * d;
    this.canvas.height = this.height * d;
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  burst(x, y, color, kind = "hit") {
    const ring = kind === "hit" ? HIT_RING : color;
    if (this.reduced) {
      this.fx.push({ type: "ring", x, y, color: ring, age: 0, life: 0.3, radius: 34 });
      return;
    }
    // A correct catch locks on with a green ring; mistakes fizzle out softly;
    // celebrations are rings-free star showers.
    const big = kind !== "error";
    if (kind !== "celebrate") this.fx.push({ type: "ring", x, y, color: ring, age: 0, life: 0.55, radius: 46, width: big ? 3 : 2 });
    if (kind === "hit") this.fx.push({ type: "ring", x, y, color: CREAM, age: -0.08, life: 0.5, radius: 30, width: 1.5 });
    const count = kind === "celebrate" ? 20 : big ? 14 : 7;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4,
        speed = big ? 70 + Math.random() * 110 : 30 + Math.random() * 50;
      this.fx.push({
        type: "particle",
        shape: i % 3 === 0 ? "sparkle" : "star",
        x,
        y,
        color: i % 4 === 0 ? CREAM : color,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        spin: (Math.random() - 0.5) * 7,
        size: big ? 10 + Math.random() * 9 : 7 + Math.random() * 5,
        gravity: big ? 60 : 20,
        age: 0,
        life: 0.45 + Math.random() * 0.35,
      });
    }
    if (kind === "hit") this.fx.push({ type: "beam", x, y, color, age: 0, life: 0.45 });
  }
  celebrate(color) {
    if (this.reduced) return;
    for (let i = 0; i < 4; i++)
      this.burst(
        this.width * (0.14 + i * 0.24 + (Math.random() - 0.5) * 0.08),
        this.height * (0.22 + Math.random() * 0.3),
        color,
        "celebrate",
      );
    const palette = [color, "#f6d98a", CREAM, "#9ec5ff", "#f3a6c0"];
    for (let i = 0; i < 70; i++)
      this.fx.push({
        type: "particle",
        shape: i % 3 ? "star" : "sparkle",
        x: Math.random() * this.width,
        y: -20 - Math.random() * this.height * 0.5,
        color: palette[i % palette.length],
        vx: (Math.random() - 0.5) * 50,
        vy: 60 + Math.random() * 90,
        spin: (Math.random() - 0.5) * 5,
        size: 10 + Math.random() * 12,
        gravity: 30,
        sway: 18 + Math.random() * 20,
        age: -Math.random() * 1.2,
        life: 3.2 + Math.random() * 1.6,
      });
  }
  shootingStar() {
    const w = this.width,
      h = this.height;
    this.fx.push({
      type: "shooting",
      x: w * (0.35 + Math.random() * 0.6),
      y: h * (0.05 + Math.random() * 0.25),
      vx: -(w * 0.35 + 180),
      vy: h * 0.18 + 60,
      age: 0,
      life: 0.95,
    });
  }
  draw(dt, session) {
    if (session?.state === "paused") dt = 0;
    this.t += dt;
    const c = this.ctx,
      w = this.width,
      h = this.height;
    c.clearRect(0, 0, w, h);
    if (!this.reduced) {
      // Hand-drawn sparkles twinkle and drift slowly across the painting.
      const game = this.screen === "game";
      for (const p of this.points) {
        const twinkle = (Math.sin(this.t * p.speed + p.phase) + 1) / 2;
        const size = p.size * (0.7 + twinkle * 0.45);
        const x = (((p.x * w + this.t * p.drift) % w) + w) % w,
          y = p.y * h;
        c.globalAlpha = (game ? 0.1 : 0.16) + twinkle * (game ? 0.2 : 0.42);
        c.drawImage(sprite(p.size > 3 ? "sparkle" : "star", CREAM), x - size, y - size, size * 2, size * 2);
      }
      if (!game && ["home", "result", "chapter", "ending"].includes(this.screen)) {
        this.nextShootingStar -= dt;
        if (this.nextShootingStar <= 0) {
          this.shootingStar();
          this.nextShootingStar = 6 + Math.random() * 7;
        }
      }
    }
    c.globalAlpha = 1;
    if (this.screen === "game") this.drawLevelAmbience(c, w, h);
    this.fx = this.fx.filter((f) => f.age < f.life);
    for (const f of this.fx) {
      f.age += dt;
      if (f.age < 0) continue;
      const p = f.age / f.life;
      c.save();
      c.globalAlpha = Math.max(0, 1 - p);
      if (f.type === "ring") {
        c.strokeStyle = f.color;
        c.lineWidth = (f.width || 2) * (1 - p * 0.6);
        c.shadowColor = f.color;
        c.shadowBlur = 12;
        c.beginPath();
        c.arc(f.x, f.y, 10 + (1 - Math.pow(1 - p, 3)) * (f.radius || 45), 0, Math.PI * 2);
        c.stroke();
      } else if (f.type === "particle") {
        const t = f.age;
        const x = f.x + f.vx * t * (1 - p * 0.35) + (f.sway ? Math.sin(t * 2.4 + f.size) * f.sway : 0);
        const y = f.y + f.vy * t * (1 - p * 0.35) + 0.5 * f.gravity * t * t;
        const size = f.size * (f.sway ? 1 : 1 - p * 0.5);
        c.globalAlpha = f.sway ? Math.min(1, (1 - p) * 2.2) : Math.max(0, 1 - p * p);
        c.translate(x, y);
        c.rotate(f.spin * t);
        c.drawImage(sprite(f.shape, f.color), -size, -size, size * 2, size * 2);
      } else if (f.type === "shooting") {
        const x = f.x + f.vx * f.age,
          y = f.y + f.vy * f.age;
        const tail = c.createLinearGradient(x, y, x - f.vx * 0.22, y - f.vy * 0.22);
        tail.addColorStop(0, "rgba(255,246,220,0.9)");
        tail.addColorStop(1, "rgba(255,246,220,0)");
        c.globalAlpha = Math.sin(p * Math.PI);
        c.strokeStyle = tail;
        c.lineWidth = 2;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x - f.vx * 0.22, y - f.vy * 0.22);
        c.stroke();
        c.drawImage(sprite("sparkle", CREAM), x - 7, y - 7, 14, 14);
      } else if (f.type === "pulse") {
        c.strokeStyle = f.color;
        c.lineWidth = 3 * (1 - p);
        c.shadowColor = f.color;
        c.shadowBlur = 16;
        c.beginPath();
        c.arc(f.x, f.y, f.r * (0.55 + p * 0.55), 0, Math.PI * 2);
        c.stroke();
      } else if (f.type === "beam" && this.screen === "game" && this.receiver) {
        this.drawBeam(c, f, p);
      }
      c.restore();
    }
  }
  drawBeam(c, f, p) {
    const curve = receiverCurve(this.receiver, f);
    if (!curve) return;
    const { edge, control } = curve;
    const gradient = c.createLinearGradient(edge.x, edge.y, f.x, f.y);
    gradient.addColorStop(0, "#c5f4ff");
    gradient.addColorStop(1, f.color);
    c.strokeStyle = gradient;
    c.lineWidth = 2;
    c.lineCap = "round";
    c.shadowColor = f.color;
    c.shadowBlur = 8;
    c.beginPath();
    c.moveTo(edge.x, edge.y);
    c.quadraticCurveTo(control.x, control.y, f.x, f.y);
    c.stroke();
    // The light packet travels from the signal to the receiver edge.
    const point = (t) => {
      const u = 1 - t;
      return [u * u * f.x + 2 * u * t * control.x + t * t * edge.x, u * u * f.y + 2 * u * t * control.y + t * t * edge.y];
    };
    c.globalAlpha = 1;
    for (let i = 4; i >= 0; i--) {
      const t = Math.max(0, Math.min(1, p * 1.15 - i * 0.05));
      const [x, y] = point(t);
      const size = 9 - i * 1.4;
      c.globalAlpha = (1 - i / 5) * (1 - Math.max(0, p - 0.85) / 0.15);
      c.drawImage(sprite("sparkle", CREAM), x - size, y - size, size * 2, size * 2);
    }
    if (p >= 0.85 && !f.arrived) {
      f.arrived = true;
      this.fx.push({ type: "pulse", x: this.receiver.x, y: this.receiver.y, r: this.receiver.r, color: HIT_RING, age: 0, life: 0.5 });
    }
  }
  drawLevelAmbience(c, w, h) {
    const level = this.level;
    if (!level) return;
    if (level.scan) {
      // Soft dividers show the scanning zones without touching the signals.
      const lines = level.scan === "three" ? [w / 3, (w * 2) / 3] : [w / 2];
      c.save();
      c.strokeStyle = "rgba(214, 222, 255, 0.2)";
      c.lineWidth = 1.5;
      c.setLineDash([2, 10]);
      c.lineCap = "round";
      for (const x of lines) {
        c.beginPath();
        c.moveTo(x, 110);
        c.lineTo(x, h - 120);
        c.stroke();
      }
      c.restore();
    }
    if (level.comets && !this.reduced) {
      const p = (this.t % 8) / 8;
      if (p < 0.2) {
        const x = w * p * 5,
          y = 120 + h * p * 1.2;
        const tail = c.createLinearGradient(x, y, x - 140, y - 38);
        tail.addColorStop(0, "rgba(200,230,255,0.55)");
        tail.addColorStop(1, "rgba(200,230,255,0)");
        c.save();
        c.globalAlpha = 1 - p / 0.2;
        c.strokeStyle = tail;
        c.lineWidth = 2;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x - 140, y - 38);
        c.stroke();
        c.restore();
      }
    }
    if (level.shimmer && !this.reduced) {
      c.globalAlpha = (Math.sin(this.t * 1.2) + 1) * 0.015;
      c.fillStyle = "#b5cfee";
      c.fillRect(0, 0, w, h);
      c.globalAlpha = 1;
    }
  }
}
