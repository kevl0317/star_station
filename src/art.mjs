import { COLORS, COLOR_NAMES, SHAPE_NAMES, CHAPTERS } from "./levels.mjs";
export const icons = {
  sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 8q5 4 0 8M19 5q8 7 0 14"/>',
  muted: '<path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6l-5 6"/>',
  settings:
    '<path d="M9 3h6l1 4 4 2v6l-4 2-1 4H9l-1-4-4-2V9l4-2z"/><circle cx="12" cy="12" r="3"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  back: '<path d="M14 5l-7 7 7 7M7 12h14"/>',
  fullscreen: '<path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  accept: '<circle cx="12" cy="12" r="9"/><path d="M7.5 12l3 3 6-6"/>',
  ignore: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
  arrow: '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
  play: '<path fill="currentColor" d="M8.5 6.3v11.4c0 .7.8 1.1 1.3.7l8.6-5.7a.8.8 0 0 0 0-1.4L9.8 5.6c-.5-.4-1.3 0-1.3.7z"/>',
  replay: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.8 4.6v3.9h-3.9"/>',
  lock: '<rect x="5.5" y="10.5" width="13" height="10" rx="2.6"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  check: '<path d="M5.5 12.5l4.2 4.2 8.8-9"/>',
  star: '<path fill="currentColor" d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  sparkle: '<path fill="currentColor" stroke="none" d="M12 2.5q.9 7.6 9.5 9.5-8.6 1.9-9.5 9.5-.9-7.6-9.5-9.5 8.6-1.9 9.5-9.5z"/>',
  book: '<path d="M5 5.2A2.2 2.2 0 0 1 7.2 3H19v14.6H7.2A2.2 2.2 0 0 0 5 19.8z"/><path d="M5 19.8A2.2 2.2 0 0 0 7.2 22H19v-4.4M9 7.5h6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.7 9.4a2.4 2.4 0 1 1 3.3 2.2c-.6.3-1 .8-1 1.4v.7"/><path d="M12 16.8v.1"/>',
  home: '<path d="M4 11.4 12 4.6l8 6.8"/><path d="M6.5 9.8v9.7h11V9.8"/>',
  records: '<path d="M9 6.5h10M9 12h10M9 17.5h10"/><path d="M4.8 6.5h.1M4.8 12h.1M4.8 17.5h.1"/>',
  download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
};
export function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.settings}</svg>`;
}
let artId = 0;
// Crayon paint: a flat colour with the shared pastel texture tinted to match.
function crayonPaint(id, color, opacity = 0.5) {
  const rgb = color.slice(1).match(/../g).map(v => parseInt(v, 16) / 255);
  const tint = rgb.map((v, i) => [i === 0 ? v : 0, i === 1 ? v : 0, i === 2 ? v : 0, 0, 0].join(' ')).join(' ') + ' 0 0 0 1 0';
  return '<filter id="' + id + '-tint" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="' + tint + '"/></filter>' +
    '<pattern id="' + id + '-paint" patternUnits="userSpaceOnUse" width="64" height="64"><rect width="64" height="64" fill="' + color + '"/><image href="./assets/signal-crayon-texture.webp" width="64" height="64" opacity="' + opacity + '" filter="url(#' + id + '-tint)"/></pattern>';
}
// All visible outer tips meet the halo inner radius, including hollow strokes.
export const SIGNAL_RADIUS = 26;
export const HALO_WIDTH = 4;
export function signalVertices(shape, radius = SIGNAL_RADIUS) {
  const count = { triangle: 3, square: 4, diamond: 4, star: 10, spark: 6 }[shape];
  if (!count) return [];
  const offset = shape === "square" ? -135 : -90;
  return Array.from({ length: count }, (_, i) => {
    const angle = (offset + i * 360 / count) * Math.PI / 180;
    const r = shape === "star" && i % 2 ? radius * 0.46 : radius;
    return [32 + Math.cos(angle) * r, 32 + Math.sin(angle) * r];
  });
}
function signalShape(shape, radius) {
  if (shape === "circle") return '<circle cx="32" cy="32" r="' + radius + '"/>';
  return '<polygon points="' + signalVertices(shape, radius).map(p => p.join(',')).join(' ') + '"/>';
}
export function signalSVG(s) {
  const c = COLORS[s.color];
  const angle = s.shape === "triangle" ? ({up:0,right:90,down:180,left:270}[s.direction] || 0) : 0;
  const id = 'signal-art-' + ++artId;
  const hollow = s.solid === false;
  // A filled disk has more visual weight than the pointed silhouettes.
  const radius = s.shape === "circle" ? 21 : SIGNAL_RADIUS;
  const shape = signalShape(s.shape, radius - (hollow ? 2 : 0));
  return '<svg viewBox="0 0 72 72" aria-hidden="true"><defs>' + crayonPaint(id, c) + '</defs><g transform="translate(4 4)">' +
    (s.halo ? '<circle cx="32" cy="32" r="'+(SIGNAL_RADIUS+HALO_WIDTH/2)+'" fill="none" stroke="#f7df9f" stroke-width="'+HALO_WIDTH+'"/><circle cx="32" cy="32" r="'+(SIGNAL_RADIUS+HALO_WIDTH/2)+'" fill="none" stroke="url(#'+id+'-paint)" stroke-opacity=".45" stroke-width="2"/>' : '') +
    '<g transform="rotate('+angle+' 32 32)" fill="'+(hollow?'none':'url(#'+id+'-paint)')+'" stroke="'+(hollow?'url(#'+id+'-paint)':'none')+'" stroke-width="4" stroke-linejoin="round">'+shape+'</g></g></svg>';
}
export function signalName(s) {
  return `${COLOR_NAMES[s.color]}${s.halo ? "带光环" : ""}${s.solid === false ? "空心" : "实心"}${s.shape === "triangle" ? { up: "朝上", down: "朝下", left: "朝左", right: "朝右" }[s.direction] || "" : ""}${SHAPE_NAMES[s.shape]}信号`;
}
const fixed = (points) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
function starPoints(cx, cy, outer, inner) {
  return fixed(Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? inner : outer;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  }));
}
// Four-armed sparkle like the hand-drawn stars in the background painting.
export function sparklePath(cx, cy, r, waist = r * 0.16) {
  return `M${cx} ${cy - r}Q${cx + waist} ${cy - waist} ${cx + r} ${cy}Q${cx + waist} ${cy + waist} ${cx} ${cy + r}Q${cx - waist} ${cy + waist} ${cx - r} ${cy}Q${cx - waist} ${cy - waist} ${cx} ${cy - r}Z`;
}
function crescentPath(ax, ay, outer, bx, by, inner) {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
  const along = (outer * outer - inner * inner + d * d) / (2 * d), h = Math.sqrt(outer * outer - along * along);
  const mx = ax + along * dx / d, my = ay + along * dy / d;
  const p = [mx + h * dy / d, my - h * dx / d], q = [mx - h * dy / d, my + h * dx / d];
  const f = (v) => v.map(n => n.toFixed(2)).join(" ");
  return `M${f(p)}A${outer} ${outer} 0 1 0 ${f(q)}A${inner} ${inner} 0 0 1 ${f(p)}Z`;
}
// Crescent moon with sparkles, echoing the moon in the background painting.
export function brandMark(className = "brand-mark") {
  return `<svg class="${className}" viewBox="0 0 48 48" aria-hidden="true"><path d="${crescentPath(21, 26, 17, 29, 19.5, 14.5)}" fill="#f6d98a"/><path d="${crescentPath(21, 26, 17, 29, 19.5, 14.5)}" fill="none" stroke="#fff3c6" stroke-width="1.2" opacity=".55"/><path d="${sparklePath(35.5, 12, 8)}" fill="#fff6dc"/><path d="${sparklePath(41, 27, 3.4)}" fill="#fff6dc" opacity=".85"/></svg>`;
}
// Result stars share the crayon paint used by the signals.
export function starSVG(earned = true) {
  const id = "star-art-" + ++artId;
  const points = starPoints(32, 34, 28, 13);
  return earned
    ? `<svg class="star-art earned" viewBox="0 0 64 64" aria-hidden="true"><defs>${crayonPaint(id, "#f7cf62", 0.6)}</defs><polygon points="${points}" fill="url(#${id}-paint)" stroke="#dc9e37" stroke-width="4.5" stroke-linejoin="round"/><path d="M22.5 26.5q3-6.5 7.5-9" fill="none" stroke="#fff8d8" stroke-width="3" stroke-linecap="round" opacity=".75"/></svg>`
    : `<svg class="star-art empty" viewBox="0 0 64 64" aria-hidden="true"><polygon points="${points}" fill="#dfe6ff12" stroke="#c9d3ff59" stroke-width="3" stroke-dasharray="5 4.5" stroke-linejoin="round"/></svg>`;
}
function tone(hex, amount) {
  return "#" + hex.slice(1).match(/../g).map(v => {
    const n = parseInt(v, 16);
    return Math.round(amount < 0 ? n * (1 + amount) : n + (255 - n) * amount).toString(16).padStart(2, "0");
  }).join("");
}
const BADGE_ICONS = [
  // 地月启航：地球与月球
  '<circle cx="17" cy="23" r="12.5" fill="#79bff0"/><path d="M8.5 17.5c2.6-2.6 6-2.4 7.2.3 1 2.2-1.6 3.8.3 5.6 1.9 1.7 5.2-.6 6.6 1.7 1.2 2-1.4 5.2-4.6 6" fill="none" stroke="#8fd89a" stroke-width="3.4" stroke-linecap="round"/><path d="M8 27.5a12.5 12.5 0 0 0 19.5 1.6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.8" stroke-linecap="round"/><path d="M27.5 13.5q3.5-5 8.2-4.8" fill="none" stroke="#fff4d6" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.6 2.8"/><circle cx="34" cy="8" r="5.6" fill="#f1ead6"/><circle cx="32.6" cy="7" r="1.3" fill="#d6ccb4"/>',
  // 向阳观测：太阳
  '<g stroke="#ffcf5e" stroke-width="3.4" stroke-linecap="round"><path d="M20 1.8v4.6M20 33.6v4.6M1.8 20h4.6M33.6 20h4.6M7.1 7.1l3.3 3.3M29.6 29.6l3.3 3.3M7.1 32.9l3.3-3.3M29.6 10.4l3.3-3.3"/></g><circle cx="20" cy="20" r="10.5" fill="#ffd66e"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#f5a93f" stroke-width="2"/><path d="M14.8 17.2q2.2-3.4 5.6-3.8" fill="none" stroke="#fff6cf" stroke-width="2.2" stroke-linecap="round"/>',
  // 火星来信：火星与两颗小卫星
  '<circle cx="18" cy="22" r="12.5" fill="#ef8a5f"/><circle cx="13.5" cy="18" r="2.6" fill="#c9613f"/><circle cx="22.5" cy="27.5" r="3.4" fill="#c9613f"/><circle cx="23.5" cy="15.5" r="1.5" fill="#c9613f"/><path d="M10 30.5a12.5 12.5 0 0 0 18 .5" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="34" cy="8.5" rx="3.4" ry="2.6" fill="#e3d2c0"/><ellipse cx="36" cy="22" rx="2.2" ry="1.7" fill="#d9c6b2"/>',
  // 巨行星之约：带环的土星
  '<g transform="rotate(-16 20 20)"><path d="M1.5 20a18.5 5.6 0 0 1 37 0" fill="none" stroke="#fff0c7" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="20" r="11" fill="#eac98c"/><path d="M9.6 16.5h20.8M9.2 22.5h21.6" stroke="#cf9f5c" stroke-width="2.2" stroke-linecap="round"/><path d="M1.5 20a18.5 5.6 0 0 0 37 0" fill="none" stroke="#fff0c7" stroke-width="3" stroke-linecap="round"/></g>',
  // 遥望远方：远方的星光
  '<path d="' + sparklePath(19, 21, 16.5, 3.1) + '" fill="#eef0ff"/><path d="' + sparklePath(34, 7, 5.2, 1.1) + '" fill="#c9cffb"/><path d="' + sparklePath(6, 35, 4, .9) + '" fill="#c9cffb"/><circle cx="35" cy="31" r="1.9" fill="#eef0ff"/><circle cx="4.5" cy="9" r="1.4" fill="#eef0ff"/>',
];
// Chapter keepsake badge: scalloped crayon medal, stitched disc and ribbon tails.
export function badgeSVG(index, earned = true) {
  const color = CHAPTERS[index].color, id = "badge-" + ++artId;
  const medal = fixed(Array.from({ length: 144 }, (_, i) => {
    const a = (i / 144) * Math.PI * 2, r = 45 + 3.2 * Math.cos(a * 18);
    return [60 + Math.cos(a) * r, 56 + Math.sin(a) * r];
  }));
  const ribbon = (dir) => `<path d="M${60 - dir * 19} 84 L${60 - dir * 33} 124 L${60 - dir * 20} 118.5 L${60 - dir * 13} 129 L${60 + dir * 2} 91 Z" fill="#e8716b" stroke="#b3484b" stroke-width="2" stroke-linejoin="round"/>`;
  return `<svg class="badge-art ${earned ? "earned" : "locked"}" viewBox="0 0 120 132" aria-hidden="true"><defs>${crayonPaint(id, tone(color, 0.12), 0.38)}<clipPath id="${id}-clip"><polygon points="${medal}"/></clipPath><linearGradient id="${id}-disc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26388c"/><stop offset="1" stop-color="#131c52"/></linearGradient></defs>${ribbon(1)}${ribbon(-1)}<polygon points="${medal}" fill="url(#${id}-paint)" stroke="${tone(color, -0.38)}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="60" cy="56" r="34" fill="url(#${id}-disc)" stroke="${tone(color, -0.45)}" stroke-width="2"/><circle cx="60" cy="56" r="29.5" fill="none" stroke="#fff4d6" stroke-opacity=".5" stroke-width="1.4" stroke-dasharray="2.2 3.4"/><g transform="translate(36.6 32.6) scale(1.17)">${BADGE_ICONS[index]}</g><g clip-path="url(#${id}-clip)"><g class="badge-shine"><rect x="-6" y="-20" width="20" height="170" fill="#fff" opacity=".42" transform="rotate(22 60 56)"/></g></g></svg>`;
}
