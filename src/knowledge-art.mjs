// Source metadata is retained for project reference, not shown in the game UI.
const cnsaPage = 'https://www.ncsti.gov.cn/kjdt/ztbd/tianwenyihao/tianwenyihaoSK/202106/t20210611_34220.html';
export const KNOWLEDGE_PHOTOS = {
  relay: { file: 'queqiao2-render.png', label: '鹊桥二号中继星', type: '官方效果图 · 非实拍', credit: '中国空间技术研究院 / 国家航天局', url: 'https://www.cnsa.gov.cn/n6758968/n6758973/c10539860/content.html' },
  lander: { file: 'change6-lander.jpg', label: '嫦娥六号着陆器与上升器', type: '月背实拍 · 2024年6月3日', credit: '国家航天局', url: 'https://www.cnsa.gov.cn/n6758823/n6758838/c10543444/content.html' },
  regolith: { file: 'change6-regolith.jpg', label: '嫦娥六号带回的月背月壤', type: '实验室实拍', credit: 'Chunlai Li、Hao Hu、Meng-Fei Yang', url: 'https://doi.org/10.1093/nsr/nwae328', license: 'https://creativecommons.org/licenses/by/4.0/' },
  rover: { file: 'zhurong.jpg', label: '祝融号与着陆平台合影', type: '火星实拍', credit: '国家航天局供图 · 新华社发布', url: cnsaPage },
  mars: { file: 'mars-surface.jpg', label: '祝融号拍摄的火星地表', type: '火星实拍', credit: '国家航天局供图 · 新华社发布', url: cnsaPage },
  phobos: { file: 'phobos.jpg', label: '火卫一 · Phobos', type: '轨道器影像 · 多波段合成', credit: 'NASA / JPL-Caltech / University of Arizona', url: 'https://science.nasa.gov/resource/martian-moon-phobos/' },
  deimos: { file: 'deimos.jpg', label: '火卫二 · Deimos（两个视角）', type: '轨道器影像 · 增强色', credit: 'NASA / JPL-Caltech / University of Arizona', url: 'https://science.nasa.gov/resource/martian-moon-deimos-in-high-resolution/' },
  storm: { file: 'great-red-spot.jpg', label: '大红斑：木星云层中的巨大风暴', type: '朱诺号影像 · 增强色', credit: 'NASA / JPL-Caltech / SwRI / MSSS · Kevin M. Gill（CC BY）', url: 'https://science.nasa.gov/photojournal/the-great-red-spot/' },
  clouds: { file: 'jupiter-clouds.jpg', label: '木星翻涌的云层', type: '朱诺号影像 · 增强色', credit: 'NASA / JPL-Caltech / SwRI / MSSS · Sergey Dushkin', url: 'https://science.nasa.gov/photojournal/juno-captures-jupiter-cloudscape-in-high-resolution/' },
  rings: { file: 'rings.jpg', label: '卡西尼号拍摄的土星 A 环局部', type: '探测器实拍', credit: 'NASA / JPL / Space Science Institute', url: 'https://science.nasa.gov/photojournal/propeller-swarm/' },
  pluto: { file: 'pluto.jpg', label: '冥王星 · 柯伊伯带中的矮行星', type: '新视野号影像 · 近自然色', credit: 'NASA / JHUAPL / SwRI / Alex Parker', url: 'https://science.nasa.gov/resource/true-colors-of-pluto/' },
};
function photo(key) {
  const p = KNOWLEDGE_PHOTOS[key];
  const mission = {storm: "朱诺号影像", clouds: "朱诺号影像", pluto: "新视野号影像"}[key];
  return `<figure class="knowledge-photo"><button type="button" class="photo-original" data-photo-src="./assets/knowledge/${p.file}" data-photo-title="${p.label}" aria-label="查看大图：${p.label}"><img src="./assets/knowledge/${p.file}" alt="${p.label}" loading="lazy" decoding="async"></button><figcaption><strong>${p.label}</strong>${mission ? `<span class="photo-mission">${mission}</span>` : ""}</figcaption></figure>`;
}
const illustration = (html) => `<div class="card-figure knowledge-illustration">${html}</div>`;
const svg = (label, html, viewBox = '0 0 600 260') => `<svg class="learning-diagram" viewBox="${viewBox}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${html}</svg>`;
const body = (id, x, y, size) => `<image href="./assets/solar-art-v1/${id}.webp" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
const label = (x, y, text, color = '#e6eff0', size = 15) => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="middle">${text}</text>`;

function relayDiagram() {
  return `<div class="relay-photos">${photo('relay')}${photo('lander')}</div>` + illustration(svg('地球与月背的嫦娥六号经鹊桥二号中继通信', `${body('earth',0,12,66)}<path d="M94 42h111m177 0h110" fill="none" stroke="#e8cf94" stroke-width="2"/><path d="M94 42l8-5m-8 5 8 5m103-5-8-5m8 5-8 5M382 42l8-5m-8 5 8 5m110-5-8-5m8 5-8 5" fill="none" stroke="#e8cf94" stroke-width="2"/>${label(33,99,'地球', '#e6eff0',14)}${label(294,46,'鹊桥二号','#f3d493',20)}${label(294,78,'中继通信','#abc7d4',14)}${body('moon',507,6,77)}${label(548,99,'月球背面','#e6eff0',13)}`, '0 0 600 115'));
}

export function solarOrbitDiagram({ showLabels = true } = {}) {
  const ids = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune-ringless'];
  const names = ['水星','金星','地球','火星','木星','土星','天王星','海王星'];
  return svg('太阳和围绕太阳运行的八大行星', `${[49,71,94,117,145,175,207,237].map(r=>`<ellipse cx="300" cy="116" rx="${r}" ry="${r*.39}" fill="none" stroke="#8ca8c1" stroke-opacity=".3"/>`).join('')}${body('sun',271,87,58)}${showLabels ? label(300,155,'太阳','#f3d493',13) : ''}${ids.map((id,i)=>{const a=[3.2,5.6,1.05,3.7,.2,2.5,5.1,3.05][i], r=[49,71,94,117,145,175,207,237][i], x=300+Math.cos(a)*r, y=116+Math.sin(a)*r*.39, s=[17,22,23,20,40,50,32,30][i];return `${body(id,x-s/2,y-s/2,s)}${showLabels ? label(x,y+s/2+16,names[i],'#e4eaf0',12) : ''}`;}).join('')}${showLabels ? label(300,253,'八大行星围绕太阳公转','#adcbd6',14) : ''}`);
}

export function milkyWayDiagram() {
  // Sun position follows the official PIA10748 annotated version (700, 968 at 1400px).
  return `<svg class="learning-diagram galaxy-diagram" viewBox="0 0 1400 1400" role="img" aria-label="银河系示意图，标出太阳系在猎户臂的位置"><image href="./assets/knowledge/milky-way.jpg" width="1400" height="1400"/><circle cx="700" cy="968" r="18" fill="#fff0a1" stroke="#2a2017" stroke-width="5"/><circle cx="700" cy="968" r="35" fill="none" stroke="#ffe5a0" stroke-width="5"/><path d="M729 986L922 1110h330" fill="none" stroke="#ffe5a0" stroke-width="5"/><text x="1040" y="1173" fill="#fff0bc" stroke="#080d19" stroke-width="9" paint-order="stroke fill" font-size="54" text-anchor="middle">太阳系 · 猎户臂</text></svg>`;
}

export function knowledgeFigure(id) {
  if (id === 20) return illustration(svg('四颗巨行星都有行星环', ['jupiter','saturn','uranus','neptune-ringless'].map((id,i)=>{
    const x=75+i*150;
    return `${body(id,x-57,55,114)}${[0,3].includes(i)?`<ellipse cx="${x}" cy="113" rx="64" ry="17" fill="none" stroke="#d8e9f5" stroke-width="2" transform="rotate(-18 ${x} 113)"/>`:''}${label(x,205,['木星','土星','天王星','海王星'][i])}`;
  }).join('') + label(300,250,'行星环示意','#adcbd6',12)));
  if (id === 4) return `<div class="relay-figure">${relayDiagram()}</div>`;
  if (id === 6) return illustration(solarOrbitDiagram());
  if (id === 25) return `<div class="card-figure knowledge-illustration">${milkyWayDiagram()}</div><div class="galaxy-credit"><button type="button" class="photo-text-button" data-photo-src="./assets/knowledge/milky-way-annotated.jpg" data-photo-title="银河系标注图">查看大图</button></div>`;
  const keys = {5:['regolith'],11:['mars'],12:['rover'],13:['phobos','deimos'],17:['storm'],18:['clouds'],19:['rings'],24:['pluto']}[id];
  if (!keys) return null;
  return `<div class="card-figure photo-figure ${keys.length>1?'photo-pair':''}">${keys.map(photo).join('')}</div>`;
}
