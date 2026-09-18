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
    this.points = Array.from({ length: 65 }, (_, i) => ({
      x: ((i * 7919) % 997) / 997,
      y: ((i * 3571) % 991) / 991,
      size: i % 7 === 0 ? 1.7 : 0.7,
      phase: i * 1.3,
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
    if (this.reduced) {
      this.fx.push({ type: "ring", x, y, color, age: 0, life: 0.3 });
      return;
    }
    this.fx.push({ type: "ring", x, y, color, age: 0, life: 0.55 });
    for (let i = 0; i < (kind === "hit" ? 18 : 8); i++) {
      const a = (i / 18) * Math.PI * 2;
      this.fx.push({
        type: "spark",
        x,
        y,
        color,
        vx: Math.cos(a) * (30 + Math.random() * 75),
        vy: Math.sin(a) * (30 + Math.random() * 75),
        age: 0,
        life: 0.35 + Math.random() * 0.4,
      });
    }
    if (kind === "hit") this.fx.push({ type: "beam", x, y, color, age: 0, life: 0.45 });
  }
  celebrate(color) {
    for (let i = 0; i < 5; i++)
      this.burst(this.width * (0.2 + i * 0.15), this.height * (0.3 + (i % 2) * 0.2), color);
  }
  draw(dt, session) {
    if (session?.state === "paused") dt = 0;
    this.t += dt;
    const c = this.ctx,
      w = this.width,
      h = this.height;
    c.clearRect(0, 0, w, h);
    if (!this.reduced)
      for (const p of this.points) {
        c.globalAlpha = 0.14 + (Math.sin(this.t * 0.5 + p.phase) + 1) * 0.18;
        c.fillStyle = "#c8f5ff";
        c.beginPath();
        c.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        c.fill();
      }
    c.globalAlpha = 1;
    if (this.screen === "game") {
      c.strokeStyle = "#82c8e912";
      c.lineWidth = 1;
      if (this.level?.scan) {
        for (const x of this.level.scan === "three" ? [w / 3, (w * 2) / 3] : [w / 2]) {
          c.setLineDash([3, 12]);
          c.beginPath();
          c.moveTo(x, 100);
          c.lineTo(x, h - 100);
          c.stroke();
          c.setLineDash([]);
        }
      }
      if (this.level?.comets && !this.reduced) {
        const p = (this.t % 8) / 8;
        if (p < 0.18) {
          c.save();
          c.globalAlpha = (1 - p / 0.18) * 0.5;
          c.strokeStyle = "#abdaeb";
          c.beginPath();
          c.moveTo(w * p * 5, 120 + h * p * 1.2);
          c.lineTo(w * p * 5 - 95, 120 + h * p * 1.2 - 26);
          c.stroke();
          c.restore();
        }
      }
      if (this.level?.shimmer && !this.reduced) {
        c.globalAlpha = (Math.sin(this.t * 1.2) + 1) * 0.015;
        c.fillStyle = "#b5cfee";
        c.fillRect(0, 0, w, h);
        c.globalAlpha = 1;
      }
    }
    this.fx = this.fx.filter((f) => f.age < f.life);
    for (const f of this.fx) {
      f.age += dt;
      const p = f.age / f.life;
      c.save();
      c.globalAlpha = Math.max(0, 1 - p);
      c.fillStyle = f.color;
      c.strokeStyle = f.color;
      c.shadowColor = f.color;
      c.shadowBlur = 10;
      if (f.type === "ring") {
        c.lineWidth = 2;
        c.beginPath();
        c.arc(f.x, f.y, 12 + p * 45, 0, Math.PI * 2);
        c.stroke();
      }
      if (f.type === "spark") {
        c.fillRect(f.x + f.vx * f.age, f.y + f.vy * f.age, 3 * (1 - p) + 1, 3 * (1 - p) + 1);
      }
      if (f.type === "beam" && this.screen === "game" && this.receiver) {
        const curve = receiverCurve(this.receiver, f);
        if (curve) {
          const { edge, control } = curve;
          const gradient = c.createLinearGradient(edge.x, edge.y, f.x, f.y);
          gradient.addColorStop(0, "#c5f4ff");
          gradient.addColorStop(1, f.color);
          c.strokeStyle = gradient;
          c.lineWidth = 1.5;
          c.beginPath();
          c.moveTo(edge.x, edge.y);
          c.quadraticCurveTo(control.x, control.y, f.x, f.y);
          c.stroke();
          c.fillStyle = "#e4fbff";
          c.beginPath();
          const t = Math.min(1, p),
            u = 1 - t;
          c.arc(
            u * u * f.x + 2 * u * t * control.x + t * t * edge.x,
            u * u * f.y + 2 * u * t * control.y + t * t * edge.y,
            2.4,
            0,
            Math.PI * 2,
          );
          c.fill();
        }
      }
      c.restore();
    }
  }
}
