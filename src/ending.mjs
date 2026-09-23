import { bunnySVG } from './astronomy.mjs';
import { solarOrbitDiagram, milkyWayDiagram } from './knowledge-art.mjs';
import { badgeSVG, icon } from './art.mjs';
import { CHAPTERS } from './levels.mjs';

export const COSMOS_CAPTIONS = ['八大行星围绕太阳公转', '太阳系在银河系的猎户臂上'];

// The solar system shrinks into its place in the Milky Way (script S07); skippable.
export function endingHTML(save, { animated = true } = {}) {
  const stars = Object.values(save.stars).reduce((sum, n) => sum + n, 0);
  return `<div class="ending-content">
    <p class="ending-kicker">星际信号站 · 旅程完成</p>
    <h1>每一份信号，<br>都有了回响。</h1>
    <div class="ending-cosmos ${animated ? 'playing' : 'settled'}" id="ending-cosmos">
      <div class="cosmos-solar">${solarOrbitDiagram({ showLabels: false, animated })}</div>
      <div class="cosmos-galaxy">${milkyWayDiagram()}</div>
    </div>
    <div class="cosmos-controls"><p class="cosmos-caption" id="cosmos-caption">${COSMOS_CAPTIONS[animated ? 0 : 1]}</p>${animated ? `<button class="text-button" data-action="skip-ending">跳过动画</button>` : ''}</div>
    <div class="ending-farewell"><div class="ending-bunny">${bunnySVG}</div><div class="bunny-speech"><p>25 个观测节点，全部接通！</p></div></div>
    <div class="ending-badges">${CHAPTERS.map((c, i) => `<span title="${c.badge}" role="img" aria-label="${c.badge}" style="--i:${i}">${badgeSVG(i, true)}</span>`).join('')}</div>
    <div class="ending-stats"><span><strong>25 / 25</strong>观测节点</span><span><strong>★ ${stars} / 75</strong>收集星星</span><span><strong>${save.cards.length} / 25</strong>知识收藏</span></div>
    <div class="ending-actions"><button class="action-button gold" data-action="home">返回主页 <b>${icon('home')}</b></button><button class="action-button outline" data-action="atlas">查看星图图鉴 <b>${icon('book')}</b></button></div>
  </div>`;
}
