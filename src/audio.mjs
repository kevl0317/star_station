export class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambient = [];
  }
  unlock() {
    if (this.muted) return;
    try {
      this.ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state !== "running") this.ctx.resume().catch(() => {});
    } catch {}
  }
  tone(frequency, at = 0, duration = 0.18, volume = 0.035, type = "sine") {
    if (this.muted || this.ctx?.state !== "running") return;
    const t = this.ctx.currentTime + at,
      o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = frequency;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(t);
    o.stop(t + duration + 0.01);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }
  play(name) {
    const tones = {
      hit: [660, 990],
      error: [160, 125],
      count: [420],
      launch: [220, 330, 440, 660],
      win: [392, 494, 587, 784],
      repair: [262, 330, 392, 523, 659, 784],
      click: [470],
    };
    (tones[name] || tones.click).forEach((f, i) =>
      this.tone(f, i * 0.075, name === "repair" ? 0.6 : 0.18, name === "error" ? 0.04 : 0.03),
    );
  }
  bed(on) {
    this.stop();
    if (!on || this.muted || this.ctx?.state !== "running") return;
    for (const f of [65.41, 98, 130.81]) {
      const o = this.ctx.createOscillator(),
        g = this.ctx.createGain();
      o.frequency.value = f;
      g.gain.value = 0.004;
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start();
      this.ambient.push([o, g]);
    }
  }
  stop() {
    for (const [o, g] of this.ambient) {
      o.stop();
      o.disconnect();
      g.disconnect();
    }
    this.ambient = [];
  }
  mute(value) {
    this.muted = value;
    this.stop();
    if (value) this.ctx?.suspend().catch(() => {});
    else this.unlock();
  }
}
