/** 《柑橘味的夏天》官网渲染逻辑 */

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ---------- 首页 ---------- */

document.getElementById('seriesIntro').textContent = SERIES_INTRO;

const epCards = document.getElementById('epCards');
for (const ep of EPISODES) {
  const card = el('button', 'epCard');
  card.style.background = `linear-gradient(135deg, ${ep.color[0]}, ${ep.color[1]})`;
  card.innerHTML = `
    <div class="epNo">第 ${ep.no} 集</div>
    <div class="epTitle">${ep.title}</div>
    <div class="epSub">「${ep.subtitle}」</div>
    <div class="epMeta">${ep.duration} · 点击播放</div>`;
  card.onclick = () => openEpisode(ep);
  epCards.appendChild(card);
}

/* ---------- 播放器 ---------- */

const player = document.getElementById('player');
const video = document.getElementById('video');
const videoFallback = document.getElementById('videoFallback');

function openEpisode(ep) {
  document.getElementById('playerTitle').textContent = ep.title;
  document.getElementById('fbName').textContent = ep.video;
  video.src = ep.video;
  videoFallback.hidden = false;
  video.hidden = false;

  // 分镜剧情 + 剧照（无图时自动退回水彩占位卡）
  const sceneList = document.getElementById('sceneList');
  sceneList.innerHTML = '';
  ep.scenes.forEach((s, i) => {
    const item = el('div', 'sceneItem');
    const imgWrap = el('div', 'sceneStill');
    imgWrap.style.background = `linear-gradient(135deg, ${ep.color[0]}, ${ep.color[1]})`;
    const img = document.createElement('img');
    img.alt = `第${ep.no}集 第${i + 1}镜剧照`;
    img.src = s.still;
    img.onload = () => imgWrap.classList.add('hasImg');
    img.onerror = () => img.remove();
    const ph = el('div', 'stillPh', `<span>第 ${i + 1} 镜</span>`);
    imgWrap.appendChild(ph);
    imgWrap.appendChild(img);
    const desc = el('div', 'sceneDesc', `<b>#${String(i + 1).padStart(2, '0')}</b> ${s.desc}`);
    item.appendChild(imgWrap);
    item.appendChild(desc);
    sceneList.appendChild(item);
  });

  // 旁白列表
  const narr = document.getElementById('narrList');
  narr.innerHTML = '';
  ep.narration.forEach((n, i) => {
    narr.appendChild(
      el('li', '', `<span class="narrNo">${i + 1}</span> <span class="jp">${n.jp}</span><span class="cn">${n.cn}</span>`),
    );
  });

  player.hidden = false;
  player.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 视频文件不存在时显示占位（不黑屏）
video.addEventListener('error', () => {
  if (video.src) {
    video.hidden = true;
    videoFallback.hidden = false;
  }
});
video.addEventListener('loadedmetadata', () => {
  videoFallback.hidden = true;
  video.hidden = false;
});

document.getElementById('playerClose').onclick = () => {
  video.pause();
  player.hidden = true;
};

/* ---------- 角色卡 ---------- */

const charCards = document.getElementById('charCards');
for (const c of CHARACTERS) {
  const card = el('div', 'charCard');
  card.innerHTML = `
    <div class="charAvatar" style="background: ${c.color}22; border-color: ${c.color}66">${c.name[0]}</div>
    <div class="charBody">
      <div class="charName">${c.name}</div>
      <div class="charLook">${c.look}</div>
      <div class="charNature">${c.nature}</div>
      <div class="charNote">${c.note}</div>
    </div>`;
  charCards.appendChild(card);
}

/* ---------- 幕后 ---------- */

const making = document.getElementById('making');
MAKING_OF.steps.forEach((s, i) => {
  making.appendChild(
    el('div', 'makingStep', `<div class="stepNo">${i + 1}</div><div><div class="stepTitle">${s.title}</div><p>${s.body}</p></div>`),
  );
});
