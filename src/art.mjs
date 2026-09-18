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
const paths = {
  circle: '<circle cx="32" cy="32" r="19"/>',
  triangle: '<path d="M32 10L54 49H10Z"/>',
  square: '<rect x="13" y="13" width="38" height="38" rx="5"/>',
  diamond: '<path d="M32 7L56 32L32 57L8 32Z"/>',
  star: '<path d="M32 7L39 24L57 25L43 37L48 55L32 45L16 55L21 37L7 25L25 24Z"/>',
  spark: '<path d="M32 7L54 20L54 44L32 57L10 44L10 20Z"/>',
};
export function signalSVG(s) {
  const c = COLORS[s.color],
    angle = { up: 0, right: 90, down: 180, left: 270 }[s.direction] || 0;
  return `<svg viewBox="0 0 72 72" aria-hidden="true"><g transform="translate(4 4)">${s.halo ? `<circle cx="32" cy="32" r="30" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="32" cy="2" r="3" fill="#fff9d2"/>` : ""}<g transform="rotate(${s.shape === "triangle" ? angle : 0} 32 32)" fill="${s.solid === false ? "none" : c}" fill-opacity="${s.solid === false ? 0 : 0.78}" stroke="${c}" stroke-width="2.6" stroke-linejoin="round">${paths[s.shape]}</g>${s.solid !== false ? `<path d="M24 26l6-5" stroke="#ffffffaa" stroke-width="2.2" stroke-linecap="round"/>` : ""}</g></svg>`;
}
export function signalName(s) {
  return `${COLOR_NAMES[s.color]}${s.halo ? "带光环" : ""}${s.solid === false ? "空心" : "实心"}${s.shape === "triangle" ? { up: "朝上", down: "朝下", left: "朝左", right: "朝右" }[s.direction] || "" : ""}${SHAPE_NAMES[s.shape]}信号`;
}
export function towerSVG(segments = 0, color = "#8addec", big = false) {
  return `<svg class="tower-art ${big ? "large" : ""}" viewBox="0 0 100 130" aria-hidden="true"><path d="M20 122h60L70 110H30Z" fill="#1a3546" stroke="#648598"/><path d="M38 113L44 46H56L62 113" fill="#142939" stroke="#658390" stroke-width="2"/><path d="M43 45h14M50 44V16" stroke="#8ca6ac" stroke-width="3"/><path d="M29 23Q50 47 71 23L65 16Q50 32 35 16Z" fill="#68808c" stroke="#bfdae0"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${39 + i * 0.6} ${102 - i * 10}h${22 - i * 1.2}v5H${39 + i * 0.6}Z" fill="${i < segments ? color : "#294352"}" ${i < segments ? `style="filter:drop-shadow(0 0 4px ${color})"` : ""}/>`).join("")}<circle cx="50" cy="12" r="4" fill="${segments === 5 ? color : "#91634d"}"/>${segments === 5 ? `<path d="M28 10Q50-6 72 10M19 3Q50-20 81 3" fill="none" stroke="${color}" opacity=".5" stroke-width="2"/>` : ""}</svg>`;
}
export const droneSVG = `<svg viewBox="0 0 180 180" class="drone" aria-hidden="true"><defs><linearGradient id="drone-shell" x2=".3" y2="1"><stop stop-color="#e8f1e9"/><stop offset="1" stop-color="#708f9d"/></linearGradient></defs><path d="M80 42L68 17" stroke="#7597aa" stroke-width="4"/><circle cx="65" cy="13" r="6" fill="#ffbd75"/><path d="M40 78L20 86L25 113L43 116M140 78L160 86L155 113L137 116" fill="#e8a66a" stroke="#434c55" stroke-width="3"/><path d="M55 39L122 39L143 68V127L125 144H56L37 126V69Z" fill="url(#drone-shell)" stroke="#c9e3e5" stroke-width="2"/><path d="M61 63H119L131 76V111L118 121H61L49 110V76Z" fill="#0c2538" stroke="#466271" stroke-width="5"/><rect class="drone-eye" x="63" y="84" width="17" height="10" rx="5" fill="#85f1f1"/><rect class="drone-eye" x="101" y="84" width="17" height="10" rx="5" fill="#85f1f1"/><path d="M82 108Q90 113 98 108" fill="none" stroke="#82e5e7" stroke-width="2"/><path d="M70 147l-4 12M110 147l4 12" stroke="#657e86" stroke-width="6"/><path d="M79 45h22" stroke="#eba26d" stroke-width="5"/></svg>`;
