import { COLORS, COLOR_NAMES, SHAPE_NAMES } from "./levels.mjs";
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
};
export function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.settings}</svg>`;
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
let signalArtId = 0;
export function signalSVG(s) {
  const c = COLORS[s.color];
  const angle = s.shape === "triangle" ? ({up:0,right:90,down:180,left:270}[s.direction] || 0) : 0;
  const id = 'signal-art-' + ++signalArtId;
  const rgb = c.slice(1).match(/../g).map(v => parseInt(v,16)/255);
  const tint = rgb.map((v,i) => [i===0?v:0,i===1?v:0,i===2?v:0,0,0].join(' ')).join(' ') + ' 0 0 0 1 0';
  const hollow = s.solid === false;
  // A filled disk has more visual weight than the pointed silhouettes.
  const radius = s.shape === "circle" ? 21 : SIGNAL_RADIUS;
  const shape = signalShape(s.shape, radius - (hollow ? 2 : 0));
  return '<svg viewBox="0 0 72 72" aria-hidden="true"><defs>' +
    '<filter id="'+id+'-tint" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="'+tint+'"/></filter>' +
    '<pattern id="'+id+'-paint" patternUnits="userSpaceOnUse" width="64" height="64"><rect width="64" height="64" fill="'+c+'"/><image href="./assets/signal-crayon-texture.png" width="64" height="64" opacity=".5" filter="url(#'+id+'-tint)"/></pattern>' +
    '</defs><g transform="translate(4 4)">' +
    (s.halo ? '<circle cx="32" cy="32" r="'+(SIGNAL_RADIUS+HALO_WIDTH/2)+'" fill="none" stroke="#f7df9f" stroke-width="'+HALO_WIDTH+'"/><circle cx="32" cy="32" r="'+(SIGNAL_RADIUS+HALO_WIDTH/2)+'" fill="none" stroke="url(#'+id+'-paint)" stroke-opacity=".45" stroke-width="2"/>' : '') +
    '<g transform="rotate('+angle+' 32 32)" fill="'+(hollow?'none':'url(#'+id+'-paint)')+'" stroke="'+(hollow?'url(#'+id+'-paint)':'none')+'" stroke-width="4" stroke-linejoin="round">'+shape+'</g></g></svg>';
}
export function signalName(s) {
  return `${COLOR_NAMES[s.color]}${s.halo ? "带光环" : ""}${s.solid === false ? "空心" : "实心"}${s.shape === "triangle" ? { up: "朝上", down: "朝下", left: "朝左", right: "朝右" }[s.direction] || "" : ""}${SHAPE_NAMES[s.shape]}信号`;
}
export function towerSVG(segments = 0, color = "#8addec", big = false) {
  return `<svg class="tower-art ${big ? "large" : ""}" viewBox="0 0 100 130" aria-hidden="true"><path d="M20 122h60L70 110H30Z" fill="#1a3546" stroke="#648598"/><path d="M38 113L44 46H56L62 113" fill="#142939" stroke="#658390" stroke-width="2"/><path d="M43 45h14M50 44V16" stroke="#8ca6ac" stroke-width="3"/><path d="M29 23Q50 47 71 23L65 16Q50 32 35 16Z" fill="#68808c" stroke="#bfdae0"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${39 + i * 0.6} ${102 - i * 10}h${22 - i * 1.2}v5H${39 + i * 0.6}Z" fill="${i < segments ? color : "#294352"}" ${i < segments ? `style="filter:drop-shadow(0 0 4px ${color})"` : ""}/>`).join("")}<circle cx="50" cy="12" r="4" fill="${segments === 5 ? color : "#91634d"}"/>${segments === 5 ? `<path d="M28 10Q50-6 72 10M19 3Q50-20 81 3" fill="none" stroke="${color}" opacity=".5" stroke-width="2"/>` : ""}</svg>`;
}
