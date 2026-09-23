import { bunnySVG, planetSVG } from './astronomy.mjs';

export function endingHTML(save) {
  const stars = Object.values(save.stars).reduce((sum, n) => sum + n, 0);
  return `<div class="ending-content">
    <div class="ending-emblem" aria-hidden="true">✦</div>
    <p class="ending-kicker">星际信号站 · 旅程完成</p>
    <h1>每一份信号，<br>都有了回响。</h1>
    <div class="ending-solar">${planetSVG('solar')}</div>
    <div class="ending-farewell"><div class="ending-bunny">${bunnySVG}</div><div>
      <p>25 个观测节点，全部接通！</p>
    </div></div>
    <div class="ending-stats"><span><strong>25 / 25</strong>观测节点</span><span><strong>★ ${stars} / 75</strong>收集星星</span><span><strong>${save.cards.length} / 25</strong>知识收藏</span></div>
    <div class="ending-actions"><button class="action-button gold" data-action="home">返回主页 <b>➜</b></button><button class="action-button outline" data-action="atlas">查看星图图鉴</button></div>
  </div>`;
}
