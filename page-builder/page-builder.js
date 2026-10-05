
"use strict";
/* ============================================================
   WebBuilding —— 拖拽式网页制作工具
   ============================================================ */

/* ---------- 工具函数 ---------- */
const $ = id => document.getElementById(id);
function el(tag, cls, html){ const n = document.createElement(tag); if(cls) n.className = cls; if(html !== undefined) n.innerHTML = html; return n; }
function uid(){ return 'e' + (uid._c = (uid._c || 1) + 1); }
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function toast(msg){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('show'), 1800);
}

/* ---------- 动画库 ---------- */
const KEYFRAMES = {
  fadeIn:      'from{opacity:0}to{opacity:1}',
  fadeInUp:    'from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}',
  fadeInDown:  'from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:translateY(0)}',
  fadeInLeft:  'from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}',
  fadeInRight: 'from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}',
  zoomIn:      'from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}',
  zoomOut:     'from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.3)}',
  slideInLeft: 'from{transform:translateX(-100%)}to{transform:translateX(0)}',
  slideInRight:'from{transform:translateX(100%)}to{transform:translateX(0)}',
  slideInUp:   'from{transform:translateY(100%)}to{transform:translateY(0)}',
  slideInDown: 'from{transform:translateY(-100%)}to{transform:translateY(0)}',
  bounce:      '0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-30px)}60%{transform:translateY(-15px)}',
  bounceIn:    '0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)}',
  pulse:       '0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}',
  heartBeat:   '0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}',
  shake:       '0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}',
  swing:       '20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}100%{transform:rotate(0)}',
  wobble:      '0%{transform:translateX(0)}15%{transform:translateX(-25px) rotate(-5deg)}30%{transform:translateX(20px) rotate(3deg)}45%{transform:translateX(-15px) rotate(-3deg)}60%{transform:translateX(10px) rotate(2deg)}75%{transform:translateX(-5px) rotate(-1deg)}100%{transform:translateX(0)}',
  tada:        '0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale(1.1) rotate(3deg)}40%,60%,80%{transform:scale(1.1) rotate(-3deg)}100%{transform:scale(1) rotate(0)}',
  jello:       '0%,100%{transform:scale(1,1)}30%{transform:scale(1.25,.75)}40%{transform:scale(.75,1.25)}50%{transform:scale(1.15,.85)}65%{transform:scale(.95,1.05)}75%{transform:scale(1.05,.95)}',
  rotateIn:    'from{opacity:0;transform:rotate(-200deg)}to{opacity:1;transform:rotate(0)}',
  rotateOut:   'from{opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(200deg)}',
  flipInX:     'from{opacity:0;transform:perspective(400px) rotateX(90deg)}to{opacity:1;transform:perspective(400px) rotateX(0)}',
  flipInY:     'from{opacity:0;transform:perspective(400px) rotateY(90deg)}to{opacity:1;transform:perspective(400px) rotateY(0)}',
  spin:        'from{transform:rotate(0)}to{transform:rotate(360deg)}',
  float:       '0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}',
  blink:       '0%,100%{opacity:1}50%{opacity:0}',
  flash:       '0%,50%,100%{opacity:1}25%,75%{opacity:0}'
};
const EFFECT_LABELS = {
  fadeIn:'淡入', fadeInUp:'上浮淡入', fadeInDown:'下沉淡入', fadeInLeft:'左滑淡入', fadeInRight:'右滑淡入',
  zoomIn:'放大进入', zoomOut:'缩小退出', slideInLeft:'左滑入', slideInRight:'右滑入', slideInUp:'上滑入', slideInDown:'下滑入',
  bounce:'弹跳', bounceIn:'弹入', pulse:'脉冲', heartBeat:'心跳', shake:'抖动', swing:'摇摆', wobble:'晃动', tada:'缩放摇晃', jello:'果冻',
  rotateIn:'旋转进入', rotateOut:'旋转退出', flipInX:'X翻转进入', flipInY:'Y翻转进入',
  spin:'旋转', float:'漂浮', blink:'闪烁', flash:'闪光'
};
let customKeyframes = {};

function syncKeyframes(){
  let css = '';
  for(const k in KEYFRAMES) css += '@keyframes ' + k + '{' + KEYFRAMES[k] + '}\n';
  for(const k in customKeyframes) css += '@keyframes ' + k + '{' + customKeyframes[k] + '}\n';
  $('kfStyle').textContent = css;
}

/* ---------- 组件库定义 ---------- */
const COMPONENTS = [
  {type:'heading',  icon:'🔤', name:'标题',   desc:'大号标题文字'},
  {type:'text',     icon:'📝', name:'文本',   desc:'段落文本'},
  {type:'button',   icon:'🔘', name:'按钮',   desc:'可点击按钮'},
  {type:'image',    icon:'🖼️', name:'图片',   desc:'图片占位'},
  {type:'link',     icon:'🔗', name:'链接',   desc:'超链接'},
  {type:'list',     icon:'📋', name:'列表',   desc:'项目列表'},
  {type:'divider',  icon:'➖',  name:'分割线', desc:'水平分隔线'},
  {type:'container',icon:'📦', name:'容器 Box', desc:'可放入其它组件的大容器'},
  {type:'grid',     icon:'🕸️', name:'网格布局', desc:'相交行列线（CSS Grid）'},
  {type:'icon',     icon:'✨', name:'图标',   desc:'表情图标'},
  {type:'input',    icon:'⌨️', name:'输入框', desc:'文本输入框'},
];

function placeholderImg(){
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#e2e8f0"/><text x="400" y="230" font-size="36" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">图片占位</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* 把本地路径/相对路径转成浏览器可用的图片地址（Windows 盘符、UNC 路径自动转 file://） */
function normalizeImgSrc(v){
  v = (v || '').trim();
  if(!v) return '';
  if(/^(https?:|data:|blob:|file:)/i.test(v)) return v;
  if(/^[a-zA-Z]:[\\/]/.test(v)) return 'file:///' + v.replace(/\\/g, '/'); /* E:\图片\a.png → file:///E:/图片/a.png */
  if(/^\\\\/.test(v)) return 'file:' + v.replace(/\\/g, '/');              /* \\server\share\a.png → file://server/share/a.png */
  return v;                                                                /* 相对路径保持不变 */
}

/* ---------- 网格布局辅助 ---------- */
/* 统计模板的轨道数量（支持 repeat(n, ...) 与空格分隔） */
function trackCount(tpl){
  tpl = (tpl || '').trim();
  if(!tpl) return 1;
  const rm = tpl.match(/^repeat\(\s*(\d+)\s*,\s*(.+)\)$/);
  if(rm) return parseInt(rm[1], 10);
  return tpl.split(/\s+/).length;
}
/* 根据行列模板生成/修正单元格（相交的水平线与垂直线） */
function syncGridCells(grid){
  if(!grid || grid.dataset.type !== 'grid') return;
  const cols = trackCount(grid.style.gridTemplateColumns);
  const rows = trackCount(grid.style.gridTemplateRows);
  const want = cols * rows;
  const cells = Array.from(grid.children).filter(c => c.classList.contains('dsh-cell'));
  if(cells.length === want) return;
  cells.forEach(c => c.remove());
  for(let i = 0; i < want; i++){
    const cell = document.createElement('div');
    cell.className = 'dsh-cell';
    grid.appendChild(cell);
  }
}

function createComponent(type){
  let n;
  const common = { heading:'#111827', text:'#334155', button:'#ffffff', link:'#2563eb', list:'#334155', input:'#334155' };
  switch(type){
    case 'heading': n = document.createElement('h1'); n.textContent = '标题文字';
      Object.assign(n.style, {fontSize:'34px', fontWeight:'700', color:'#111827', margin:'0.4em 0', lineHeight:'1.3'}); break;
    case 'text': n = document.createElement('p'); n.textContent = '双击编辑这段文本内容，右键可调整样式。';
      Object.assign(n.style, {fontSize:'16px', lineHeight:'1.8', color:'#334155', margin:'0.6em 0'}); break;
    case 'button': n = document.createElement('button'); n.type = 'button'; n.textContent = '按钮';
      Object.assign(n.style, {padding:'11px 26px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', cursor:'pointer', display:'inline-block'}); break;
    case 'image': n = document.createElement('img'); n.src = placeholderImg(); n.alt = '';
      Object.assign(n.style, {width:'100%', borderRadius:'10px', display:'block'}); break;
    case 'link': n = document.createElement('a'); n.href = '#'; n.textContent = '链接文字';
      Object.assign(n.style, {color:'#2563eb', fontSize:'16px', textDecoration:'underline', display:'inline-block'}); break;
    case 'list': n = document.createElement('ul');
      n.innerHTML = '<li>列表项目一</li><li>列表项目二</li><li>列表项目三</li>';
      Object.assign(n.style, {paddingLeft:'26px', fontSize:'16px', color:'#334155', lineHeight:'1.9'}); break;
    case 'divider': n = document.createElement('hr');
      Object.assign(n.style, {border:'none', borderTop:'1px solid #e2e8f0', margin:'18px 0', width:'100%'}); break;
    case 'container': n = document.createElement('div'); n.className = 'dsh-el dsh-box';
      Object.assign(n.style, {minHeight:'90px', padding:'18px'}); break;
    case 'grid': n = document.createElement('div'); n.className = 'dsh-el dsh-box';
      Object.assign(n.style, {display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gridTemplateRows:'repeat(2, 1fr)', gap:'8px', minHeight:'240px', width:'100%', padding:'10px'}); break;
    case 'icon': n = document.createElement('span'); n.textContent = '⭐';
      Object.assign(n.style, {fontSize:'52px', lineHeight:'1', display:'inline-block'}); break;
    case 'input': n = document.createElement('input'); n.type = 'text'; n.placeholder = '请输入内容…';
      Object.assign(n.style, {padding:'10px 14px', border:'1px solid #cbd5e1', borderRadius:'9px', fontSize:'15px', width:'280px'}); break;
    default: n = document.createElement('div');
  }
  if(!n.classList.contains('dsh-box')) n.classList.add('dsh-el');
  n.dataset.type = type;
  n.dataset.id = uid();
  n.style.position = 'absolute';
  if(type === 'grid') syncGridCells(n);
  if(type !== 'image' && type !== 'input' && type !== 'link') n.draggable = true;
  return n;
}

function buildPalette(){
  const list = $('paletteList');
  COMPONENTS.forEach(c => {
    const item = el('div', 'comp-item');
    item.dataset.type = c.type;
    item.draggable = true;
    item.innerHTML = '<span class="ci-ic">' + c.icon + '</span><span><span class="ci-name">' + c.name + '</span><br><span class="ci-desc">' + c.desc + '</span></span>';
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/dsh-component', c.type);
      e.dataTransfer.setData('text/plain', c.type);
      e.dataTransfer.effectAllowed = 'copy';
    });
    item.addEventListener('click', () => addComponent(c.type));
    list.appendChild(item);
  });
}

/* ---------- 画布 / 状态 ---------- */
const canvas = $('canvas'), canvasWrap = $('canvasWrap'), selBox = $('selBox'), dropLine = $('dropLine');
let selected = null;
let elementClipboard = null;

const DEFAULT_PAGE = {
  title: '我的网页', width: 960, font: '',
  bgType: 'color', bgColor: '#ffffff', gradient: '', bgImage: ''
};
let pageSettings = Object.assign({}, DEFAULT_PAGE);

/* ---------- 页面设置：非编辑区（编辑器界面）配色与样式 ---------- */
const THEME_DEFAULTS = {
  accent: '#4f46e5', accent2: '#7c3aed', tbText: '#ffffff',
  panel: '#ffffff', bg: '#eef1f6', surface: '#ffffff', surface2: '#f8fafc',
  hover: '#eef2ff', line: '#e2e8f0', text: '#1e293b', muted: '#64748b'
};
const THEME_PRESETS = {
  default: Object.assign({}, THEME_DEFAULTS),
  dark: { accent:'#6366f1', accent2:'#8b5cf6', tbText:'#f1f5f9', panel:'#1e293b', bg:'#0f172a', surface:'#1e293b', surface2:'#172033', hover:'#2b3a55', line:'#334155', text:'#e2e8f0', muted:'#94a3b8' },
  blue: { accent:'#0284c7', accent2:'#2563eb', tbText:'#ffffff', panel:'#ffffff', bg:'#e8f2fb', surface:'#ffffff', surface2:'#f1f7fd', hover:'#e0f2fe', line:'#d6e4f0', text:'#0f172a', muted:'#5b7185' },
  warm: { accent:'#ea580c', accent2:'#dc2626', tbText:'#ffffff', panel:'#ffffff', bg:'#fbf0e6', surface:'#ffffff', surface2:'#fdf6f0', hover:'#ffe9d6', line:'#f0ded0', text:'#3f2d20', muted:'#8a7565' },
  green: { accent:'#059669', accent2:'#0d9488', tbText:'#ffffff', panel:'#ffffff', bg:'#e9f5ee', surface:'#ffffff', surface2:'#f1f9f4', hover:'#dcfce7', line:'#d5e8dc', text:'#12291e', muted:'#5f7a6b' }
};
let themeSettings = Object.assign({}, THEME_DEFAULTS);
let themePresetName = 'default';

/* 将主题写入 CSS 变量（仅影响非编辑区） */
function applyTheme(){
  const r = document.documentElement.style;
  r.setProperty('--accent', themeSettings.accent);
  r.setProperty('--accent2', themeSettings.accent2);
  r.setProperty('--tb-text', themeSettings.tbText);
  r.setProperty('--panel', themeSettings.panel);
  r.setProperty('--bg', themeSettings.bg);
  r.setProperty('--surface', themeSettings.surface);
  r.setProperty('--surface-2', themeSettings.surface2);
  r.setProperty('--hover', themeSettings.hover);
  r.setProperty('--line', themeSettings.line);
  r.setProperty('--text', themeSettings.text);
  r.setProperty('--muted', themeSettings.muted);
}
/* 把当前主题回填到设置面板控件 */
function syncThemeInputs(){
  document.querySelectorAll('[data-theme]').forEach(inp => {
    const v = themeSettings[inp.dataset.theme];
    if(v) inp.value = v;
  });
  document.querySelectorAll('.theme-preset').forEach(b => {
    b.classList.toggle('on', b.dataset.preset === themePresetName);
  });
}
function setThemePreset(name){
  const preset = THEME_PRESETS[name];
  if(!preset) return;
  themeSettings = Object.assign({}, preset);
  themePresetName = name;
  applyTheme();
  syncThemeInputs();
  mark();
}
function bindPageSettings(){
  $('btnPageSettings').addEventListener('click', ()=>{
    syncThemeInputs();
    $('pageSettingsModal').classList.add('open');
  });
  const close = ()=>$('pageSettingsModal').classList.remove('open');
  $('btnClosePageSettings').addEventListener('click', close);
  $('btnClosePageSettingsOk').addEventListener('click', close);
  $('pageSettingsModal').addEventListener('click', e => { if(e.target.id === 'pageSettingsModal') close(); });
  document.querySelectorAll('[data-theme]').forEach(inp => {
    inp.addEventListener('input', ()=>{
      themeSettings[inp.dataset.theme] = inp.value;
      themePresetName = '';
      applyTheme();
      syncThemeInputs();
      mark();
    });
  });
  document.querySelectorAll('.theme-preset').forEach(b => {
    b.addEventListener('click', ()=>setThemePreset(b.dataset.preset));
  });
  $('btnThemeReset').addEventListener('click', ()=>setThemePreset('default'));
}

function isEditing(){ return !!canvas.querySelector('[contenteditable]'); }
function closestEl(t){ return t && t.closest ? t.closest('.dsh-el') : null; }
function isAbs(el){ return el.style.position === 'absolute'; }
function canDragMove(el){ return el.tagName !== 'INPUT'; }

function removeHint(){
  const h = canvas.querySelector('.dsh-hint');
  if(h) h.remove();
}

/* ---------- 添加 / 插入组件 ---------- */
function addComponent(type){
  removeHint();
  const n = createComponent(type);
  /* 落点规则：选中单元格 → 该格；选中网格 → 下一个空格（一格格加入）；选中容器 → 容器内；否则画布 */
  let into = canvas;
  let keepSel = null;
  if(selected && selected.classList.contains('dsh-cell')){ into = selected; keepSel = selected; }
  else if(selected && selected.dataset.type === 'grid'){ into = nextGridCell(selected) || selected; keepSel = selected; }
  else if(selected && selected.classList.contains('dsh-box')){ into = selected; keepSel = selected; }
  if(into.classList && into.classList.contains('dsh-cell')){
    into.appendChild(n);
    centerInParent(n, into);
  } else {
    const count = into.querySelectorAll('.dsh-el').length;
    const step = 26;
    n.style.left = (20 + (count % 7) * step) + 'px';
    n.style.top = (20 + (count % 7) * step) + 'px';
    into.appendChild(n);
  }
  /* 连续添加：保持容器 / 网格 / 单元格选中，便于逐个格子放入组件 */
  selectEl(keepSel || n);
  mark();
  toast('已添加「' + (COMPONENTS.find(c=>c.type===type) || {}).name + '」');
}

/* 网格中下一个空单元格（实现一格格加入组件） */
function nextGridCell(grid){
  const cells = Array.from(grid.querySelectorAll('.dsh-cell'));
  if(!cells.length) return null;
  return cells.find(c => !c.querySelector('.dsh-el')) || cells[cells.length - 1];
}
/* 在容器 / 单元格内居中放置组件 */
function centerInParent(n, parent){
  const cw = parent.clientWidth || 0, chh = parent.clientHeight || 0;
  const ew = n.offsetWidth || 0, eh = n.offsetHeight || 0;
  n.style.left = Math.max(0, Math.round((cw - ew) / 2)) + 'px';
  n.style.top = Math.max(0, Math.round((chh - eh) / 2)) + 'px';
}
/* 网格内距离落点最近的单元格 */
function nearestCell(grid, x, y){
  const cells = Array.from(grid.querySelectorAll('.dsh-cell'));
  if(!cells.length) return null;
  let best = null, bd = Infinity;
  cells.forEach(c => {
    const r = c.getBoundingClientRect();
    const dx = (r.left + r.width / 2) - x, dy = (r.top + r.height / 2) - y;
    const d = dx * dx + dy * dy;
    if(d < bd){ bd = d; best = c; }
  });
  return best;
}

/* 计算拖放落点：优先落入网格单元格（小容器），其次容器 Box，最后画布；返回父节点与本地坐标 */
function placementParent(x, y){
  const cr = canvas.getBoundingClientRect();
  let t = document.elementFromPoint(x, y);
  if(t && t.closest && t.closest('#selBox')) t = selected;
  const cell = t && t.closest ? t.closest('.dsh-cell') : null;
  if(cell){
    const cr2 = cell.getBoundingClientRect();
    return { parent: cell, left: Math.max(0, x - cr2.left), top: Math.max(0, y - cr2.top) };
  }
  const c = t ? closestEl(t) : null;
  const box = c ? (c.classList.contains('dsh-box') ? c : c.closest('.dsh-box')) : null;
  if(box){
    /* 拖到网格上（空隙/边距）时落入最近的单元格 */
    if(box.dataset.type === 'grid'){
      const nc = nearestCell(box, x, y);
      if(nc){
        const nr = nc.getBoundingClientRect();
        return { parent: nc, left: Math.max(0, x - nr.left), top: Math.max(0, y - nr.top) };
      }
    }
    const br = box.getBoundingClientRect();
    return { parent: box, left: Math.max(0, x - br.left), top: Math.max(0, y - br.top) };
  }
  return { parent: canvas, left: Math.max(0, x - cr.left + canvasWrap.scrollLeft), top: Math.max(0, y - cr.top + canvasWrap.scrollTop) };
}
function placeComponent(type, x, y){
  removeHint();
  const n = createComponent(type);
  const pos = placementParent(x, y);
  n.style.left = pos.left + 'px';
  n.style.top = pos.top + 'px';
  pos.parent.appendChild(n);
  selectEl(n);
  mark();
  toast('已添加「' + (COMPONENTS.find(c=>c.type===type) || {}).name + '」');
}

function insertElAtPoint(n, x, y){
  const target = dropTarget(x, y);
  if(target && target !== canvas){
    const r = target.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    const before = (y - cr.top) < (r.top - cr.top) + r.height / 2;
    if(before) canvas.insertBefore(n, target); else canvas.insertBefore(n, target.nextSibling);
  } else {
    canvas.appendChild(n);
  }
}

function dropTarget(x, y){
  let t = document.elementFromPoint(x, y);
  if(!t) return null;
  if(t.closest && t.closest('#selBox')) return selected || null;
  if(t.id === 'canvas') return canvas;
  const c = closestEl(t);
  return c || canvas;
}

/* ---------- 拖放：新组件自由落点 / 流式元素行内重排 ---------- */
let dragMoveEl = null;

function clearDropTargets(){ canvas.querySelectorAll('.dsh-box.drop-target').forEach(b => b.classList.remove('drop-target')); }

canvas.addEventListener('dragover', e => {
  const types = Array.from(e.dataTransfer.types || []);
  const hasComp = types.indexOf('text/dsh-component') > -1;
  const hasMove = types.indexOf('text/dsh-move') > -1;
  if(!hasComp && !hasMove) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = hasComp ? 'copy' : 'move';
  if(hasComp){
    /* 高亮悬停的容器，提示可拖入 */
    const t = document.elementFromPoint(e.clientX, e.clientY);
    const c = t ? closestEl(t) : null;
    const box = c && (c.classList.contains('dsh-box') ? c : c.closest('.dsh-box'));
    clearDropTargets();
    if(box) box.classList.add('drop-target');
  } else if(hasMove){
    showDropLine(e.clientX, e.clientY);
  }
});
canvas.addEventListener('dragleave', e => {
  if(!canvas.contains(e.relatedTarget)){ hideDropLine(); clearDropTargets(); }
});
canvas.addEventListener('drop', e => {
  const compType = e.dataTransfer.getData('text/dsh-component');
  const moveId = e.dataTransfer.getData('text/dsh-move');
  hideDropLine(); clearDropTargets();
  if(compType){
    e.preventDefault();
    placeComponent(compType, e.clientX, e.clientY);
    return;
  }
  if(moveId){
    e.preventDefault();
    const n = canvas.querySelector('[data-id="' + moveId + '"]');
    if(!n) return;
    const target = dropTarget(e.clientX, e.clientY);
    if(target === n || (target && n.contains(target))) return;
    insertElAtPoint(n, e.clientX, e.clientY);
    selectEl(n);
    mark();
  }
});

function showDropLine(x, y){
  const target = dropTarget(x, y);
  if(!target) { hideDropLine(); return; }
  const r = target.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
  let top;
  if(target === canvas){
    const last = canvas.lastElementChild;
    top = last ? (last.getBoundingClientRect().bottom - cr.top + canvasWrap.scrollTop) : (r.top - cr.top + canvasWrap.scrollTop);
  } else {
    const before = (y - cr.top) < (r.top - cr.top) + r.height / 2;
    top = before ? (r.top - cr.top + canvasWrap.scrollTop) : (r.bottom - cr.top + canvasWrap.scrollTop);
  }
  dropLine.style.display = 'block';
  dropLine.style.top = Math.max(0, top - 1.5) + 'px';
}
function hideDropLine(){ dropLine.style.display = 'none'; }

/* ---------- 选择 / 选择框 ---------- */
function buildSelBox(){
  ['nw','n','ne','e','se','s','sw','w'].forEach(h => {
    const d = el('div', 'handle h-' + h); d.dataset.h = h; selBox.appendChild(d);
  });
}

function updateSelBox(){
  if(!selected){ selBox.style.display = 'none'; return; }
  const er = selected.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
  if(er.width === 0 && er.height === 0){ selBox.style.display = 'none'; return; }
  selBox.style.display = 'block';
  selBox.style.left = (er.left - cr.left + canvasWrap.scrollLeft) + 'px';
  selBox.style.top = (er.top - cr.top + canvasWrap.scrollTop) + 'px';
  selBox.style.width = er.width + 'px';
  selBox.style.height = er.height + 'px';
}

function selectEl(n){
  if(selected){
    selected.classList.remove('dsh-selected');
    selected.classList.remove('cell-selected');
  }
  selected = n;
  if(n){
    n.classList.add(n.classList.contains('dsh-cell') ? 'cell-selected' : 'dsh-selected');
    updateSelBox();
    syncInspector();
    renderAnimList();
  } else {
    updateSelBox();
    syncInspector();
    renderAnimList();
  }
  updateOutlineActive();
}
function deselect(){ selectEl(null); }

canvas.addEventListener('click', e => {
  if(e.target.closest && e.target.closest('#selBox')) return;
  if(isEditing()) return;
  const inCell = e.target.closest ? e.target.closest('.dsh-cell') : null;
  const c = inCell ? (e.target.closest('.dsh-cell .dsh-el') || null) : closestEl(e.target);
  if(c){ selectEl(c); }
  else if(inCell){ selectEl(inCell); }
  else if(e.target === canvas || (e.target.classList && e.target.classList.contains('dsh-hint'))){ deselect(); }
});
canvas.addEventListener('mousedown', e => {
  if(e.button !== 0) return;
  if(isEditing()) return;
  const inCell = e.target.closest ? e.target.closest('.dsh-cell') : null;
  const c = inCell ? (e.target.closest('.dsh-cell .dsh-el') || null) : closestEl(e.target);
  if(c){
    if(c.tagName === 'A'){ e.preventDefault(); }
    if(isAbs(c) && canDragMove(c)){
      e.preventDefault();
      const r = c.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      if(!c.style.left) c.style.left = (r.left - cr.left + canvasWrap.scrollLeft) + 'px';
      if(!c.style.top) c.style.top = (r.top - cr.top + canvasWrap.scrollTop) + 'px';
      dragState = { mode:'move', el:c, startX:e.clientX, startY:e.clientY,
        left:parseFloat(c.style.left), top:parseFloat(c.style.top) };
    }
  } else if(inCell){
    /* 点击网格单元格（小容器）空白处：选中它，不触发网格拖动 */
    selectEl(inCell);
  }
});
canvas.addEventListener('dragstart', e => {
  const c = closestEl(e.target);
  if(!c || isEditing()) return;
  if(isAbs(c)){ e.preventDefault(); return; }
  e.dataTransfer.setData('text/dsh-move', c.dataset.id);
  e.dataTransfer.setData('text/plain', c.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
  dragMoveEl = c;
});

/* 拖拽移动 / 缩放状态 */
let dragState = null;

selBox.addEventListener('mousedown', e => {
  const h = e.target.closest('.handle');
  if(!h || !selected) return;
  e.preventDefault(); e.stopPropagation();
  const elN = selected, r = elN.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
  dragState = {
    mode:'resize', handle:h.dataset.h, el:elN,
    startX:e.clientX, startY:e.clientY,
    left:(r.left - cr.left + canvasWrap.scrollLeft), top:(r.top - cr.top + canvasWrap.scrollTop),
    width:r.width, height:r.height,
    elLeft: elN.style.left ? parseFloat(elN.style.left) : null,
    elTop: elN.style.top ? parseFloat(elN.style.top) : null
  };
});
selBox.addEventListener('click', e => e.stopPropagation());

document.addEventListener('mousemove', e => {
  if(!dragState) return;
  const s = dragState;
  const dx = e.clientX - s.startX, dy = e.clientY - s.startY;
  canvasWrap.style.userSelect = 'none';
  if(s.mode === 'move'){
    let lx = s.left + dx, ly = s.top + dy;
    /* 靠近画布中心时显示引导线；开启磁吸后吸附居中 */
    const g = snapPos(s.el, lx, ly, snapEnabled);
    s.el.style.left = g.x + 'px';
    s.el.style.top = g.y + 'px';
    showSnapGuides(g);
  } else {
    const h = s.handle, n = s.el;
    let w = s.width, ht = s.height, l = s.left, t = s.top;
    if(h.indexOf('w') > -1){ w = s.width - dx; l = s.left + dx; }
    if(h.indexOf('e') > -1){ w = s.width + dx; }
    if(h.indexOf('n') > -1){ ht = s.height - dy; t = s.top + dy; }
    if(h.indexOf('s') > -1){ ht = s.height + dy; }
    w = Math.max(24, w); ht = Math.max(24, ht);
    n.style.width = w + 'px';
    n.style.height = ht + 'px';
    if(isAbs(n)){
      if(s.elLeft !== null && h.indexOf('w') > -1) n.style.left = (s.elLeft + dx) + 'px';
      if(s.elTop !== null && h.indexOf('n') > -1) n.style.top = (s.elTop + dy) + 'px';
      if(n.style.left && h.indexOf('w') > -1 && s.elLeft === null) n.style.left = l + 'px';
    }
  }
  updateSelBox();
});
document.addEventListener('mouseup', () => {
  if(dragState){
    if(dragState.mode === 'move') maybeReparent(dragState.el);
    dragState = null; canvasWrap.style.userSelect = ''; hideSnapGuides(); mark();
  }
});

/* 拖拽结束：组件中心落在网格单元格/容器内则移入（以该容器为基准定位）；拖出网格/容器则回到画布 */
function maybeReparent(el){
  if(!el || el.dataset.type === 'grid') return;
  const parent = el.parentNode;
  const inCell = parent.classList && parent.classList.contains('dsh-cell');
  const inBox = parent.classList && parent.classList.contains('dsh-box');
  if(parent !== canvas && !inCell && !inBox) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const prev = el.style.display;
  el.style.display = 'none';
  let t = null;
  try{ t = document.elementFromPoint(cx, cy); }catch(err){}
  el.style.display = prev;
  const cell = t && t.closest ? t.closest('.dsh-cell') : null;
  const box = t && t.closest ? t.closest('.dsh-box') : null;
  let newParent = null, rect = null;
  if(cell && !cell.contains(el)){ newParent = cell; rect = cell.getBoundingClientRect(); }
  else if(!cell && box && box !== parent && !el.contains(box)){
    /* 落在网格空隙时归入最近的单元格 */
    if(box.dataset.type === 'grid'){
      const nc = nearestCell(box, cx, cy);
      if(nc){ newParent = nc; rect = nc.getBoundingClientRect(); }
      else { newParent = box; rect = box.getBoundingClientRect(); }
    } else {
      newParent = box; rect = box.getBoundingClientRect();
    }
  }
  else if(!cell && !box && (inCell || inBox)){ newParent = canvas; rect = canvas.getBoundingClientRect(); }
  if(newParent){
    const x = newParent === canvas ? cx - rect.left + canvasWrap.scrollLeft : cx - rect.left;
    const y = newParent === canvas ? cy - rect.top + canvasWrap.scrollTop : cy - rect.top;
    el.style.left = Math.max(0, x) + 'px';
    el.style.top = Math.max(0, y) + 'px';
    newParent.appendChild(el);
    mark();
  }
}

canvasWrap.addEventListener('scroll', updateSelBox);
window.addEventListener('resize', updateSelBox);

/* 滚轮滚动兜底：无论环境如何，保证画布内容超出时可用滚轮上下滑动 */
canvasWrap.addEventListener('wheel', e => {
  if(e.ctrlKey) return; /* 保留浏览器缩放 */
  const max = canvasWrap.scrollHeight - canvasWrap.clientHeight;
  if(max <= 0) return;
  e.preventDefault();
  let dy = e.deltaY;
  if(e.deltaMode === 1) dy *= 16;          /* Firefox 行模式 */
  else if(e.deltaMode === 2) dy *= canvasWrap.clientHeight; /* 页模式 */
  canvasWrap.scrollTop += dy;
  updateSelBox();
}, { passive:false });

/* ---------- 组件目录（outline） ---------- */
const TYPE_ICONS = {};
COMPONENTS.forEach(c => { TYPE_ICONS[c.type] = c.icon; });

function renderOutline(){
  const list = $('outlineList');
  list.innerHTML = '';
  const walk = (parent, depth) => {
    Array.from(parent.children).forEach(n => {
      if(isChromeNode(n)) return;
      /* 网格单元格本身不是组件：继续深入，显示格内的组件 */
      if(n.classList && n.classList.contains('dsh-cell')){ walk(n, depth + 1); return; }
      if(!n.classList.contains('dsh-el')) return;
      const type = n.dataset.type || 'text';
      const icon = TYPE_ICONS[type] || '🔹';
      const typeName = (COMPONENTS.find(c=>c.type===type) || {}).name || '组件';
      const name = n.dataset.name || typeName;
      const txt = (n.textContent || '').replace(/\s+/g,' ').trim().slice(0, 10);
      const item = el('div', 'o-item depth-' + Math.min(depth, 2));
      item.dataset.id = n.dataset.id;
      item.title = typeName + '（双击可命名）';
      item.innerHTML = '<span class="o-ic">' + icon + '</span><span class="o-name">' + name + '</span>' + (txt ? '<span class="o-txt">' + txt + '</span>' : '');
      if(selected === n) item.classList.add('active');
      list.appendChild(item);
      if(n.classList.contains('dsh-box') || n.classList.contains('dsh-cell')) walk(n, depth + 1);
    });
  };
  walk(canvas, 0);
  if(!list.children.length) list.innerHTML = '<div class="note" style="margin-bottom:0">画布中还没有组件</div>';
}

/* 目录项交互使用事件委托（列表重建不影响点击/双击/右键） */
(function(){
  const list = $('outlineList');
  const findById = id => id ? canvas.querySelector('.dsh-el[data-id="' + id + '"]') : null;
  list.addEventListener('click', e => {
    const item = e.target.closest('.o-item');
    if(!item) return;
    const n = findById(item.dataset.id);
    if(!n) return;
    selectEl(n);
    try{ n.scrollIntoView({ block:'nearest' }); }catch(err){}
  });
  list.addEventListener('dblclick', e => {
    const item = e.target.closest('.o-item');
    if(!item) return;
    const n = findById(item.dataset.id);
    if(n) startRename(n, item);
  });
  list.addEventListener('contextmenu', e => {
    const item = e.target.closest('.o-item');
    if(!item) return;
    e.preventDefault();
    const n = findById(item.dataset.id);
    if(!n) return;
    selectEl(n);
    showContextMenu(e.clientX, e.clientY, [
      {icon:'✏️', label:'重命名…', action:()=>startRename(n, item)},
      {icon:'🗑️', label:'删除组件', danger:true, action:()=>removeEl(n)},
    ]);
  });
})();

/* 选中状态仅更新高亮，不重建列表（保证双击命名等交互不被打断） */
function updateOutlineActive(){
  $('outlineList').querySelectorAll('.o-item').forEach(it => {
    it.classList.toggle('active', !!(selected && it.dataset.id && it.dataset.id === selected.dataset.id));
  });
}

/* 目录内联重命名组件 */
function startRename(n, item){
  const nameSpan = item.querySelector('.o-name');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'o-rename';
  input.value = n.dataset.name || '';
  input.placeholder = '组件名称';
  nameSpan.replaceWith(input);
  input.focus(); input.select();
  const commit = () => {
    const v = input.value.trim();
    if(v) n.dataset.name = v; else delete n.dataset.name;
    mark();
  };
  input.addEventListener('click', e => e.stopPropagation());
  input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){ commit(); input.blur(); }
    else if(e.key === 'Escape'){ input._cancel = true; input.blur(); }
  });
  input.addEventListener('blur', () => { if(!input._cancel) commit(); renderOutline(); });
}

/* ---------- 磁吸吸附 ---------- */
let snapEnabled = false;
const SNAP_THRESHOLD = 6;

/* 元素相对指定父级内容区的坐标（沿 style 累加） */
function relPos(el, parent){
  let top = 0, left = 0, n = el;
  while(n && n !== parent){
    top += parseFloat(n.style.top) || 0;
    left += parseFloat(n.style.left) || 0;
    n = n.parentNode;
  }
  return { top, left };
}

/* 计算吸附位置与引导线：与同父级组件/容器边界 左中右、上中下 对齐；画布中心附近显示居中引导线（开启磁吸后吸附居中） */
function snapPos(el, x, y, snapping){
  const parent = el.parentNode;
  const isBoxParent = (parent !== canvas) && parent.classList && (parent.classList.contains('dsh-box') || parent.classList.contains('dsh-cell'));
  const w = el.offsetWidth || 0, h = el.offsetHeight || 0;
  const myX = [x, x + w/2, x + w];
  const myY = [y, y + h/2, y + h];
  let bdx = 1e9, bdy = 1e9, xi = -1, yi = -1;
  const consider = (cxArr, cyArr) => {
    for(let i=0;i<3;i++){
      const dx = cxArr[i] - myX[i];
      if(Math.abs(dx) < Math.abs(bdx)){ bdx = dx; xi = i; }
      const dy = cyArr[i] - myY[i];
      if(Math.abs(dy) < Math.abs(bdy)){ bdy = dy; yi = i; }
    }
  };
  /* 同父级组件（容器/单元格内组件也可互相吸附） */
  const siblings = isBoxParent
    ? Array.from(parent.querySelectorAll(':scope > .dsh-el'))
    : Array.from(canvas.children).filter(c => !isChromeNode(c) && c.classList.contains('dsh-el'));
  siblings.forEach(c => {
    if(c === el || el.contains(c) || c.contains(el)) return;
    const p = relPos(c, parent);
    const cw = c.offsetWidth || 0, ch = c.offsetHeight || 0;
    consider([p.left, p.left + cw/2, p.left + cw], [p.top, p.top + ch/2, p.top + ch]);
  });
  /* 容器内还可吸附到容器边界 */
  if(isBoxParent){
    const cw = parent.offsetWidth || 0, ch = parent.offsetHeight || 0;
    consider([0, cw/2, cw], [0, ch/2, ch]);
  }
  /* 画布中心：垂直/水平居中引导线 */
  if(parent === canvas){
    const cs = window.getComputedStyle(canvas);
    const padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0;
    const padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
    const cw = canvas.clientWidth - padL - padR;
    const ch = canvas.clientHeight - padT - padB;
    const dx = (cw / 2) - myX[1];
    if(Math.abs(dx) < Math.abs(bdx)){ bdx = dx; xi = 1; }
    const dy = (ch / 2) - myY[1];
    if(Math.abs(dy) < Math.abs(bdy)){ bdy = dy; yi = 1; }
  }
  const TH = snapping ? SNAP_THRESHOLD : 16; /* 未开启磁吸时仅显示居中引导线 */
  const sx = (xi > -1 && Math.abs(bdx) <= TH);
  const sy = (yi > -1 && Math.abs(bdy) <= TH);
  /* 参考线换算为画布坐标 */
  const pp = (parent === canvas) ? { top:0, left:0 } : absPos(parent);
  return {
    x: (snapping && sx) ? x + bdx : x,
    y: (snapping && sy) ? y + bdy : y,
    gx: sx ? pp.left + (x + bdx) + [0, w/2, w][xi] : null,
    gy: sy ? pp.top + (y + bdy) + [0, h/2, h][yi] : null
  };
}
function showSnapGuides(g){
  const v = $('snapV'), hh = $('snapH');
  if(g.gx !== null){ v.style.display = 'block'; v.style.left = g.gx + 'px'; }
  else v.style.display = 'none';
  if(g.gy !== null){ hh.style.display = 'block'; hh.style.top = g.gy + 'px'; }
  else hh.style.display = 'none';
}
function hideSnapGuides(){ $('snapV').style.display = 'none'; $('snapH').style.display = 'none'; }

/* ---------- 双击编辑文本 ---------- */
/* 图片加载失败提示（本地路径或网址错误时给出反馈） */
canvas.addEventListener('error', e => {
  const t = e.target;
  if(t && t.tagName === 'IMG'){
    const src = t.getAttribute('src') || '';
    if(src && src.indexOf('data:') !== 0) toast('图片加载失败：' + src.slice(0, 48));
  }
}, true);

canvas.addEventListener('dblclick', e => {
  const c = closestEl(e.target);
  if(c){
    if(c.tagName === 'INPUT'){ c.focus(); return; }
    startEdit(c);
    return;
  }
  const cell = e.target.closest ? e.target.closest('.dsh-cell') : null;
  if(cell) selectEl(cell);
});

function canEditText(n){
  if(n.classList && n.classList.contains('dsh-cell')) return false;
  return ['H1','H2','H3','H4','H5','H6','P','BUTTON','A','SPAN','LI','DIV','UL','OL'].indexOf(n.tagName) > -1;
}
function startEdit(n){
  if(!canEditText(n)) return;
  n.setAttribute('contenteditable', 'plaintext-only');
  n.draggable = false;
  canvas.classList.add('editing');
  n.focus();
  const r = document.createRange();
  r.selectNodeContents(n);
  const s = window.getSelection();
  s.removeAllRanges(); s.addRange(r);
}
function endEdit(n){
  if(!n.hasAttribute('contenteditable')) return;
  n.removeAttribute('contenteditable');
  if(n.tagName !== 'IMG' && n.tagName !== 'INPUT' && n.tagName !== 'A') n.draggable = true;
  canvas.classList.remove('editing');
  /* 图标组件允许清空（不强制回填 ⭐）；其它文本组件空内容时给出占位提示 */
  if(!n.textContent.trim() && n.dataset.type !== 'icon') n.textContent = '（空白）';
  mark();
}
canvas.addEventListener('focusout', e => {
  const n = e.target.closest('[contenteditable]');
  if(n && !n.contains(e.relatedTarget)) endEdit(n);
});
canvas.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    const n = e.target.closest('[contenteditable]');
    if(n && ['BUTTON','A'].indexOf(n.tagName) > -1){
      e.preventDefault(); n.blur();
    }
  }
});

/* ---------- 右键菜单 ---------- */
const COLORS = ['#ffffff','#000000','#f43f5e','#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#14b8a6','#06b6d4','#0ea5e9','#3b82f6','#6366f1','#8b5cf6','#a855f7','#d946ef','#ec4899','#64748b','#94a3b8','#cbd5e1','#f1f5f9','#f8fafc'];
const GRADIENTS = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#30cfd0 0%,#330867 100%)',
  'linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%)'
];
const SIZES = [12,14,16,18,20,24,28,32,40,48,64];
const SHADOWS = ['0 1px 3px rgba(0,0,0,.12)','0 4px 12px rgba(0,0,0,.18)','0 12px 32px rgba(0,0,0,.25)'];
const QUICK_EFFECTS = ['fadeIn','fadeInUp','fadeInLeft','zoomIn','bounceIn','bounce','pulse','heartBeat','shake','swing','rotateIn','float','blink','spin'];
const EMOJIS = ['⭐','❤️','🔥','👍','🎉','🚀','🌟','💡','📌','✅','🎯','💎','🌈','⚡','🎵','🏆','💖','😀','🌹','🍀','☀️','🌙','🐱','🐶','🍕','🎮','📷','🎨'];

let currentMenu = null;

function closeContextMenu(){ if(currentMenu){ currentMenu.remove(); currentMenu = null; } }

/* 子菜单定位：右侧弹出，空间不足时翻转到左侧；靠近底部时向上收拢，保证任意层级都在视口内 */
function positionSub(sub, row){
  sub.style.left = 'auto'; sub.style.right = 'auto';
  sub.style.top = '-6px'; sub.style.bottom = 'auto';
  const rw = row.getBoundingClientRect();
  const sw = sub.offsetWidth, sh = sub.offsetHeight, margin = 8;
  sub.style.left = '100%';
  if(rw.right + sw > window.innerWidth - margin && rw.left - 10 >= sw){
    sub.style.left = 'auto'; sub.style.right = '100%';
  }
  if(rw.top + sh > window.innerHeight - margin){
    sub.style.top = Math.max(4 - rw.top, window.innerHeight - margin - sh - rw.top) + 'px';
  }
}

function buildMenuItems(menu, items){
  items.forEach(it => {
    if(it.sep){ menu.appendChild(el('div','ctx-sep')); return; }
    const row = el('div','ctx-item');
    row.innerHTML = (it.icon ? '<span class="ctx-ic">' + it.icon + '</span>' : '') + '<span class="ctx-label">' + it.label + '</span>';
    if(it.colorGrid || it.gradientGrid){
      row.classList.add('ctx-grid');
      row.innerHTML = '<div class="cg-title">' + it.label + '</div>';
      const g = el('div', it.colorGrid ? 'ctx-swatches' : 'ctx-swatches');
      (it.colorGrid || it.gradientGrid).forEach(c => {
        const sw = el('div','ctx-swatch');
        if(it.gradientGrid) sw.style.background = c; else sw.style.background = c;
        sw.addEventListener('click', ev => { ev.stopPropagation(); closeContextMenu(); it.onPick(c); });
        g.appendChild(sw);
      });
      row.appendChild(g);
      const cust = el('label','ctx-custom');
      cust.innerHTML = '自定义';
      const ci = document.createElement('input'); ci.type = 'color';
      ci.addEventListener('input', () => { it.onPick(ci.value); });
      cust.appendChild(ci);
      row.appendChild(cust);
      menu.appendChild(row);
      return;
    }
    if(it.emojiGrid){
      row.classList.add('ctx-grid');
      row.innerHTML = '<div class="cg-title">' + it.label + '</div>';
      const g = el('div','ctx-emoji');
      it.emojiGrid.forEach(em => {
        const b = el('button', '', em);
        b.addEventListener('click', ev => { ev.stopPropagation(); closeContextMenu(); it.onPick(em); });
        g.appendChild(b);
      });
      row.appendChild(g);
      menu.appendChild(row);
      return;
    }
    if(it.sub){
      row.classList.add('has-sub');
      const sub = el('div','ctx-menu ctx-sub');
      buildMenuItems(sub, it.sub);
      row.appendChild(sub);
      row.addEventListener('mouseenter', () => { sub.style.display = 'block'; positionSub(sub, row); });
      row.addEventListener('mouseleave', () => { sub.style.display = 'none'; });
    }
    if(it.action) row.addEventListener('click', ev => { ev.stopPropagation(); closeContextMenu(); it.action(); });
    if(it.danger) row.classList.add('danger');
    if(it.disabled) row.classList.add('disabled');
    menu.appendChild(row);
  });
}

function showContextMenu(x, y, items){
  closeContextMenu();
  const menu = el('div','ctx-menu');
  buildMenuItems(menu, items);
  document.body.appendChild(menu);
  const r = menu.getBoundingClientRect();
  menu.style.left = Math.max(4, Math.min(x, window.innerWidth - r.width - 8)) + 'px';
  menu.style.top = Math.max(4, Math.min(y, window.innerHeight - r.height - 8)) + 'px';
  currentMenu = menu;
}

/* 右键菜单内容 —— 保持简洁，复杂操作交给右侧面板 */
function elementMenu(n){
  const items = [];
  const textable = canEditText(n);
  if(textable) items.push({icon:'✏️', label:'编辑文本', action:()=>startEdit(n)});
  if(textable && n.tagName !== 'A') items.push({icon:'🔗', label:'设为超链接', action:()=>makeLink(n)});
  if(n.tagName === 'A'){
    items.push({icon:'🔗', label:'设置链接地址…', action:()=>{
      const u = prompt('输入链接地址:', n.getAttribute('href') || 'https://');
      if(u !== null) n.setAttribute('href', u || '#');
      mark();
    }});
    if(n.dataset.wrappedId) items.push({icon:'🔓', label:'取消超链接', action:()=>unlink(n)});
  }
  if(n.tagName === 'BUTTON'){
    items.push({icon:'↗️', label: n.dataset.href ? '修改跳转链接…' : '设置跳转链接…', action:()=>{
      const u = prompt('输入跳转链接地址（留空取消）:', n.dataset.href || 'https://');
      if(u !== null){ if(u) n.dataset.href = u; else delete n.dataset.href; mark(); syncInspector(); }
    }});
  }
  if(n.dataset.type === 'icon') items.push({icon:'🎭', label:'更换图标', emojiGrid:EMOJIS, onPick:em=>{ n.textContent = em; mark(); }});
  if(n.tagName === 'IMG') items.push({icon:'🖼️', label:'设置图片地址…', action:()=>{
    const u = prompt('输入图片地址（支持本地路径，如 E:\\图片\\a.png；留空恢复占位图）:', n.getAttribute('src') && n.getAttribute('src').indexOf('data:') !== 0 ? n.getAttribute('src') : '');
    if(u !== null) n.src = normalizeImgSrc(u) || placeholderImg();
    mark();
  }});
  items.push({sep:true});
  items.push({icon:'🗑️', label:'删除元素', danger:true, action:()=>removeEl(n)});
  items.push({sep:true});
  items.push({icon:'🎨', label:'打开样式面板', action:()=>openInspector('style')});
  items.push({icon:'✨', label:'打开动画面板', action:()=>openInspector('anim')});
  return items;
}

function blankMenu(){
  return [
    {icon:'🖼️', label:'页面背景', sub:[
      {label:'纯色', colorGrid:COLORS, onPick:c=>setPage({bgType:'color', bgColor:c})},
      {label:'渐变', gradientGrid:GRADIENTS, onPick:g=>setPage({bgType:'gradient', gradient:g})},
      {label:'背景图片…', action:()=>{ const u = prompt('输入背景图片地址（留空清除）:'); if(u !== null) setPage(u ? {bgType:'image', bgImage:u} : {bgType:'color', bgColor:'#ffffff', bgImage:''}); }},
      {label:'清除背景', action:()=>setPage({bgType:'color', bgColor:'#ffffff', bgImage:'', gradient:''})},
    ]},
    {sep:true},
    {label:'打开「页面」面板', action:()=>openInspector('page')},
  ];
}

/* 通用操作 */
function isChromeNode(c){
  return c.id === 'selBox' || c.id === 'dropLine' || c.id === 'snapV' || c.id === 'snapH' || (c.classList && c.classList.contains('dsh-hint'));
}
function removeEl(n){
  if(n.classList && n.classList.contains('dsh-cell')){
    /* 网格单元格为结构元素：删除操作改为清空其内容 */
    if(n === selected) deselect();
    n.innerHTML = '';
    mark();
    toast('已清空该格内容');
    return;
  }
  if(n === selected) deselect();
  n.remove();
  mark();
  toast('已删除');
}

/* ---------- 设为超链接 / 取消超链接 ---------- */
function makeLink(n){
  if(n.tagName === 'A') return;
  const origId = n.dataset.id;
  const abs = isAbs(n);
  const a = document.createElement('a');
  a.className = 'dsh-el';
  a.href = '#';
  a.dataset.type = 'link';
  a.dataset.id = uid();
  a.dataset.wrappedId = origId;
  a.draggable = false;
  n.classList.remove('dsh-el');
  if(abs){
    ['position','left','top','width','height','zIndex'].forEach(p => {
      if(n.style[p]) a.style[p] = n.style[p];
    });
    n.style.position = '';
    ['left','top','width','height','zIndex'].forEach(p => { n.style[p] = ''; });
  }
  n.parentNode.insertBefore(a, n);
  a.appendChild(n);
  selectEl(a);
  mark();
  toast('已设为超链接（右键可设置地址）');
}
function unlink(a){
  const inner = a.firstElementChild;
  a.classList.remove('dsh-el');
  const abs = isAbs(a);
  while(a.firstChild) a.parentNode.insertBefore(a.firstChild, a);
  if(inner){
    inner.classList.add('dsh-el');
    inner.draggable = true;
    if(abs){
      inner.style.position = a.style.position || 'absolute';
      ['left','top','width','height','zIndex'].forEach(p => { inner.style[p] = a.style[p] || ''; });
    }
  }
  a.remove();
  selectEl(inner);
  mark();
}

/* 页面设置 */
function setPage(patch){
  Object.assign(pageSettings, patch);
  applyPageToCanvas();
  syncPagePanel();
  mark();
}

function applyPageToCanvas(){
  canvas.style.width = pageSettings.width + 'px';
  canvas.style.backgroundColor = pageSettings.bgColor;
  canvas.style.fontFamily = pageSettings.font;
  if(pageSettings.bgType === 'gradient'){
    canvas.style.backgroundImage = pageSettings.gradient; canvas.style.backgroundSize = 'cover';
  } else if(pageSettings.bgType === 'image'){
    canvas.style.backgroundImage = 'url("' + pageSettings.bgImage + '")';
    canvas.style.backgroundSize = 'cover'; canvas.style.backgroundPosition = 'center'; canvas.style.backgroundRepeat = 'no-repeat';
  } else {
    canvas.style.backgroundImage = 'none';
  }
  updateSelBox();
}

/* ---------- 右键打开 ---------- */
canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  const inCell = e.target.closest ? e.target.closest('.dsh-cell') : null;
  const c = inCell ? (e.target.closest('.dsh-cell .dsh-el') || null) : closestEl(e.target);
  if(c){
    selectEl(c);
    showContextMenu(e.clientX, e.clientY, elementMenu(c));
  } else if(inCell){
    selectEl(inCell);
    showContextMenu(e.clientX, e.clientY, [
      {icon:'🧹', label:'清空该格内容', action:()=>{ inCell.innerHTML = ''; mark(); }},
      {label:'打开样式面板', action:()=>openInspector('style')},
    ]);
  } else {
    showContextMenu(e.clientX, e.clientY, blankMenu());
  }
});
document.addEventListener('mousedown', e => {
  if(currentMenu && !currentMenu.contains(e.target)) closeContextMenu();
});

/* ---------- 面板切换 ---------- */
function openInspector(tab){
  document.querySelectorAll('#inspector .tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('#inspector .pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + tab));
}
document.querySelectorAll('#inspector .tab-btn').forEach(b => {
  b.addEventListener('click', () => openInspector(b.dataset.tab));
});

/* ---------- 样式面板 ---------- */
function setStyleProp(prop, val){
  if(!selected) return;
  if(val === '' || val === null || val === undefined){ selected.style[prop] = ''; }
  else selected.style[prop] = val;
  mark();
}
function numVal(v){ return v === '' || v === null ? '' : parseFloat(v); }

function syncInspector(){
  const n = selected;
  if(!n){
    $('styleGroups').style.display = 'none';
    $('styleEmpty').style.display = 'block';
    $('animArea').style.display = 'none';
    $('animEmpty').style.display = 'block';
    return;
  }
  $('styleEmpty').style.display = 'none';
  $('styleGroups').style.display = 'block';
  $('animArea').style.display = 'block';
  $('animEmpty').style.display = 'none';

  const s = n.style;
  /* 按组件类型显示匹配的样式组：无文本/无背景的组件隐藏对应分组 */
  const tag = n.tagName;
  const isGrid = n.dataset.type === 'grid';
  const isCell = n.classList && n.classList.contains('dsh-cell');
  const textable = ['H1','H2','H3','H4','H5','H6','P','BUTTON','A','SPAN','LI','DIV','UL','OL'].indexOf(tag) > -1;
  $('g-text').style.display = (textable && !isGrid && !isCell) ? 'block' : 'none';
  $('g-bg').style.display = (tag === 'HR' || tag === 'IMG') ? 'none' : 'block';
  $('g-grid').style.display = isGrid ? 'block' : 'none';
  if(isGrid){
    $('gridMode').value = n.style.display === 'flex' ? 'flex' : 'grid';
    $('gridCols').value = trackCount(n.style.gridTemplateColumns) || 3;
    $('gridRows').value = trackCount(n.style.gridTemplateRows) || 2;
    $('gridGap').value = n.style.gap ? parseFloat(n.style.gap) : '';
    const firstCell = n.querySelector('.dsh-cell');
    $('gridCellW').value = firstCell && firstCell.style.width ? parseFloat(firstCell.style.width) : 30;
  }
  $('fz').value = numVal(s.fontSize);
  $('fw').value = s.fontWeight || '';
  $('ta').value = s.textAlign || '';
  $('lh').value = numVal(s.lineHeight);
  $('ls').value = numVal(s.letterSpacing);
  $('cText').value = toHex(s.color, '#000000');
  $('cBg').value = toHex(s.backgroundColor, '#ffffff');
  const bi = s.backgroundImage || '';
  if(bi.indexOf('url(') === 0){
    const m = bi.match(/url\("?([^")]+)"?\)/);
    $('bgImg').value = m ? m[1] : '';
    $('grad').value = '';
  } else if(bi.indexOf('linear-gradient') > -1){
    $('bgImg').value = '';
    $('grad').value = bi;
  } else {
    $('bgImg').value = '';
    $('grad').value = '';
  }
  $('bw').value = numVal(s.borderWidth);
  $('bs').value = s.borderStyle || '';
  $('bc').value = toHex(s.borderColor, '#000000');
  $('br').value = numVal(s.borderRadius);
  const sh = s.boxShadow;
  if(sh && sh !== 'none'){
    const idx = SHADOWS.indexOf(sh);
    if(idx > -1){ $('shSel').value = SHADOWS[idx]; $('shCustomWrap').style.display = 'none'; }
    else { $('shSel').value = 'custom'; $('shCustom').value = sh; $('shCustomWrap').style.display = 'flex'; }
  } else {
    $('shSel').value = ''; $('shCustomWrap').style.display = 'none';
  }
  $('w').value = s.width || '';
  $('h').value = s.height || '';
  $('op').value = s.opacity ? Math.round(parseFloat(s.opacity) * 100) : 100;
  $('pos').value = s.position || '';
  $('l').value = s.left ? parseFloat(s.left) : '';
  $('t').value = s.top ? parseFloat(s.top) : '';
  $('z').value = s.zIndex ? parseInt(s.zIndex, 10) : '';
  $('row-href').style.display = n.tagName === 'A' ? 'flex' : 'none';
  $('row-btn').style.display = n.tagName === 'BUTTON' ? 'flex' : 'none';
  $('row-src').style.display = n.tagName === 'IMG' ? 'flex' : 'none';
  if(n.tagName === 'A') $('hrefIn').value = n.getAttribute('href') || '';
  if(n.tagName === 'BUTTON') $('btnHref').value = n.dataset.href || '';
  if(n.tagName === 'IMG') $('srcIn').value = (n.getAttribute('src') || '').indexOf('data:') === 0 ? '' : (n.getAttribute('src') || '');
  $('animMode').value = getAnimMode(n);
}

function toHex(v, fb){
  if(!v || v === 'transparent' || v === 'rgba(0, 0, 0, 0)') return fb;
  if(v[0] === '#'){
    return v.length === 4 ? '#' + v[1]+v[1]+v[2]+v[2]+v[3]+v[3] : v;
  }
  const hx = x => ('0' + parseInt(x, 10).toString(16)).slice(-2);
  let m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if(m) return '#' + hx(m[1]) + hx(m[2]) + hx(m[3]);
  const c = new Option().style; c.color = v;
  const h = c.color || '';
  m = h.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if(m) return '#' + hx(m[1]) + hx(m[2]) + hx(m[3]);
  return fb;
}

function bindStylePanel(){
  const num = (id, prop, conv) => {
    $(id).addEventListener('input', () => {
      const v = $(id).value;
      setStyleProp(prop, v === '' ? '' : (conv ? conv(v) : v));
      updateSelBox();
    });
  };
  num('fz','fontSize', v=>v+'px'); num('lh','lineHeight'); num('ls','letterSpacing', v=>v+'px');
  num('bw','borderWidth', v=>v+'px'); num('br','borderRadius', v=>v+'px');
  num('l','left', v=>v+'px'); num('t','top', v=>v+'px'); num('z','zIndex');
  $('fw').addEventListener('change', ()=>setStyleProp('fontWeight',$('fw').value));
  $('ta').addEventListener('change', ()=>setStyleProp('textAlign',$('ta').value));
  $('cText').addEventListener('input', ()=>setStyleProp('color',$('cText').value));
  $('cBg').addEventListener('input', ()=>setStyleProp('backgroundColor',$('cBg').value));
  const applyBgFromPanel = () => {
    const g = $('grad').value.trim();
    const img = $('bgImg').value.trim();
    if(img) setStyleProp('backgroundImage', 'url("' + img + '")');
    else if(g){ setStyleProp('backgroundImage', g); setStyleProp('backgroundColor',''); }
    else setStyleProp('backgroundImage','');
  };
  $('grad').addEventListener('input', applyBgFromPanel);
  $('bgImg').addEventListener('input', applyBgFromPanel);
  $('bs').addEventListener('change', ()=>{
    const v = $('bs').value;
    if(!v){ setStyleProp('borderStyle',''); setStyleProp('borderWidth',''); }
    else setStyleProp('borderStyle', v);
  });
  $('bc').addEventListener('input', ()=>setStyleProp('borderColor',$('bc').value));
  $('shSel').addEventListener('change', ()=>{
    const v = $('shSel').value;
    if(v === 'custom'){ $('shCustomWrap').style.display = 'flex'; return; }
    $('shCustomWrap').style.display = 'none';
    setStyleProp('boxShadow', v || 'none');
  });
  $('shCustom').addEventListener('input', ()=>setStyleProp('boxShadow', $('shCustom').value || 'none'));
  $('w').addEventListener('input', ()=>{
    let v = $('w').value.trim();
    if(v && /^\d+$/.test(v)) v += 'px';
    setStyleProp('width', v);
  });
  $('h').addEventListener('input', ()=>{
    let v = $('h').value.trim();
    if(v && /^\d+$/.test(v)) v += 'px';
    setStyleProp('height', v);
  });
  $('op').addEventListener('input', ()=>{
    const v = parseInt($('op').value, 10);
    setStyleProp('opacity', v >= 100 ? '' : (v / 100));
  });
  $('pos').addEventListener('change', ()=>{
    const v = $('pos').value;
    setStyleProp('position', v);
    if(v === 'absolute' && selected){
      const r = selected.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      if(!selected.style.left) selected.style.left = (r.left - cr.left + canvasWrap.scrollLeft) + 'px';
      if(!selected.style.top) selected.style.top = (r.top - cr.top + canvasWrap.scrollTop) + 'px';
      syncInspector();
    }
    if(!v && selected){ selected.style.left = ''; selected.style.top = ''; }
    updateSelBox();
  });
  $('hrefIn').addEventListener('input', ()=>{ if(selected) selected.setAttribute('href', $('hrefIn').value || '#'); mark(); });
  $('srcIn').addEventListener('input', ()=>{ if(selected) selected.src = normalizeImgSrc($('srcIn').value) || placeholderImg(); mark(); });
  $('btnHref').addEventListener('input', ()=>{
    if(!selected) return;
    const v = $('btnHref').value.trim();
    if(v) selected.dataset.href = v; else delete selected.dataset.href;
    mark();
  });
  $('btnEditText').addEventListener('click', ()=>{ if(selected) startEdit(selected); });
  $('btnCopyEl').addEventListener('click', ()=>{ if(selected){ elementClipboard = selected.cloneNode(true); toast('已复制元素'); } });
  $('btnDeleteEl').addEventListener('click', ()=>{ if(selected) removeEl(selected); });
  /* 网格布局配置：网格（行列线）/ 弹性盒子（可调格宽高），列/行仅接受数字 */
  const gridApplier = () => {
    if(!selected || selected.dataset.type !== 'grid') return;
    const mode = $('gridMode').value;
    const cols = Math.max(1, Math.min(12, parseInt($('gridCols').value, 10) || 3));
    const rows = Math.max(1, Math.min(12, parseInt($('gridRows').value, 10) || 2));
    /* 列数 × 行数 同时决定轨道数量与单元格个数（弹性模式下用于确定格子数量） */
    selected.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    selected.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';
    if(mode === 'flex'){
      selected.style.display = 'flex';
      selected.style.flexWrap = 'wrap';
      selected.style.alignContent = 'flex-start';
    } else {
      selected.style.display = 'grid';
      selected.style.flexWrap = '';
      selected.style.alignContent = '';
    }
    selected.style.gap = $('gridGap').value !== '' ? $('gridGap').value + 'px' : '';
    syncGridCells(selected);
    if(mode === 'flex'){
      const cw = Math.max(5, Math.min(100, parseInt($('gridCellW').value, 10) || 30));
      selected.querySelectorAll('.dsh-cell').forEach(cell => { cell.style.width = cw + '%'; });
    } else {
      selected.querySelectorAll('.dsh-cell').forEach(cell => { cell.style.width = ''; });
    }
    mark();
  };
  $('gridMode').addEventListener('change', gridApplier);
  $('gridCols').addEventListener('input', gridApplier);
  $('gridRows').addEventListener('input', gridApplier);
  $('gridCellW').addEventListener('input', gridApplier);
  $('gridGap').addEventListener('input', gridApplier);
  $('btnReset').addEventListener('click', ()=>{
    if(!selected) return;
    const n = selected;
    const anim = n.dataset.anim;
    n.removeAttribute('style');
    if(anim){ n.dataset.anim = anim; applyAnims(n); }
    if(n.classList.contains('dsh-box')) Object.assign(n.style, {minHeight:'90px', padding:'18px'});
    mark(); syncInspector();
  });
}

/* ---------- 动画系统 ---------- */
function getAnims(n){
  try{ const a = JSON.parse(n.dataset.anim || '[]'); return Array.isArray(a) ? a : []; }
  catch(e){ return []; }
}
function getAnimMode(n){ return n.dataset.animMode === 'sequence' ? 'sequence' : 'parallel'; }
/* 组合播放：parallel 同时叠加；sequence 按顺序衔接（延迟自动累加） */
function animsToCss(layers, mode){
  let acc = 0;
  return layers.map(l => {
    const dur = parseFloat(l.duration) || 0;
    let d = parseFloat(l.delay) || 0;
    if(mode === 'sequence'){ d = acc + d; acc += dur; }
    return l.effect + ' ' + dur + 's ' + l.easing + ' ' + d + 's ' +
      (l.iteration === 'infinite' ? 'infinite' : l.iteration) + ' ' + l.direction + ' ' + l.fill;
  }).join(', ');
}
function setAnims(n, layers){
  n.dataset.anim = JSON.stringify(layers);
  applyAnims(n);
  mark();
}
function applyAnims(n){
  playLayers(n, getAnims(n), getAnimMode(n));
}

/* ---------- WAAPI 组合动画引擎 ---------- */
/* 解析 CSS 关键帧字符串（from/to/百分比）为 WAAPI keyframes 数组 */
function parseKeyframes(cssBody){
  const frames = [];
  cssBody.split('}').forEach(part => {
    const m = part.match(/^([\d.,%\w-]+)\{(.*)$/);
    if(!m) return;
    const decls = {};
    m[2].split(';').forEach(d => {
      d = d.trim();
      const ci = d.indexOf(':');
      if(ci > -1) decls[d.slice(0, ci).trim()] = d.slice(ci + 1).trim();
    });
    m[1].split(',').forEach(sel => {
      sel = sel.trim();
      let offset;
      if(sel === 'from') offset = 0;
      else if(sel === 'to') offset = 1;
      else offset = parseFloat(sel) / 100;
      const f = Object.assign({}, decls);
      if(!isNaN(offset)) f.offset = offset;
      frames.push(f);
    });
  });
  frames.sort((a, b) => (a.offset || 0) - (b.offset || 0));
  return frames;
}
/* 取消元素上的 WAAPI 动画与 CSS 动画 */
function cancelLayers(n){
  if(n._waapiAnims){
    n._waapiAnims.forEach(a => { try{ a.cancel(); }catch(e){} });
    n._waapiAnims = [];
  }
  n.style.animation = '';
}
/* 播放组合动画：WAAPI 逐属性合成（transform 用 add 叠加，动画1 与 动画2 真正同时生效）；
   依次播放时自动累加延迟，实现「动画1 延迟跟随 动画2」；不支持 WAAPI 时回退 CSS */
function playLayers(n, layers, mode){
  cancelLayers(n);
  if(!layers.length) return;
  if(typeof n.animate !== 'function'){
    n.style.animation = animsToCss(layers, mode);
    return;
  }
  n._waapiAnims = [];
  let acc = 0;
  layers.forEach(l => {
    const css = customKeyframes[l.effect] || KEYFRAMES[l.effect];
    if(!css) return;
    const kfs = parseKeyframes(css);
    const duration = (parseFloat(l.duration) || 0) * 1000;
    let delay = (parseFloat(l.delay) || 0) * 1000;
    if(mode === 'sequence'){ delay = acc + delay; acc += duration; }
    const opts = {
      duration: duration,
      delay: delay,
      easing: l.easing || 'ease',
      iterations: l.iteration === 'infinite' ? Infinity : (parseInt(l.iteration, 10) || 1),
      direction: l.direction || 'normal',
      fill: l.fill || 'both'
    };
    const props = {};
    kfs.forEach(f => { Object.keys(f).forEach(p => { if(p !== 'offset') props[p] = 1; }); });
    Object.keys(props).forEach(prop => {
      const pf = kfs.map(f => {
        const o = {}; o[prop] = f[prop];
        if(f.offset !== undefined) o.offset = f.offset;
        return o;
      });
      try{
        n._waapiAnims.push(n.animate(pf, Object.assign({}, opts, { composite: prop === 'transform' ? 'add' : 'replace' })));
      }catch(e){
        try{ n._waapiAnims.push(n.animate(pf, opts)); }catch(e2){}
      }
    });
  });
}

const EASINGS = ['ease','ease-in','ease-out','ease-in-out','linear','cubic-bezier(.68,-.55,.27,1.55)'];
const DIRECTIONS = ['normal','reverse','alternate','alternate-reverse'];
const FILLS = ['both','none','forwards','backwards'];

function renderAnimList(){
  const list = $('animList');
  list.innerHTML = '';
  const n = selected;
  if(!n) return;
  const layers = getAnims(n);
  if(!layers.length){
    list.innerHTML = '<div class="note" style="margin-bottom:0">暂无动画，点击上方「添加动画效果」开始。</div>';
    return;
  }
  layers.forEach((l, i) => {
    const row = el('div','anim-row');
    const head = el('div','a-head');
    head.innerHTML = '<span class="a-ef">' + (EFFECT_LABELS[l.effect] || l.effect) + '</span><span class="a-time">' + l.duration + 's</span>';
    const play = el('button','mini','▶'); play.title = '预览';
    const del = el('button','mini del','✕'); del.title = '删除该层';
    head.appendChild(play); head.appendChild(del);
    const detail = el('div','a-detail');
    detail.style.display = 'none';
    const mk = (label, field, control) => {
      const lab = el('label', '', label); lab.appendChild(control);
      control.value = l[field];
      control.addEventListener('change', () => {
        l[field] = control.value;
        setAnims(n, layers);
        renderAnimList();
      });
      detail.appendChild(lab);
    };
    const efSel = document.createElement('select');
    Object.keys(KEYFRAMES).concat(Object.keys(customKeyframes)).forEach(k => {
      const o = document.createElement('option'); o.value = k; o.textContent = EFFECT_LABELS[k] || k;
      efSel.appendChild(o);
    });
    mk('效果', 'effect', efSel);
    const dur = document.createElement('input'); dur.type = 'number'; dur.min = 0.1; dur.max = 10; dur.step = 0.1;
    mk('时长(秒)', 'duration', dur);
    const delay = document.createElement('input'); delay.type = 'number'; delay.min = 0; delay.max = 10; delay.step = 0.1;
    mk('延迟(秒)', 'delay', delay);
    const ease = document.createElement('select');
    EASINGS.forEach(e => { const o = document.createElement('option'); o.value = e; o.textContent = e; ease.appendChild(o); });
    mk('缓动', 'easing', ease);
    const iter = document.createElement('select');
    [1,2,3,5,10,'infinite'].forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v === 'infinite' ? '∞ 无限循环' : v + ' 次'; iter.appendChild(o); });
    mk('播放次数', 'iteration', iter);
    const dir = document.createElement('select');
    DIRECTIONS.forEach(d => { const o = document.createElement('option'); o.value = d; o.textContent = d; dir.appendChild(o); });
    mk('方向', 'direction', dir);
    const fill = document.createElement('select');
    FILLS.forEach(f => { const o = document.createElement('option'); o.value = f; o.textContent = f; fill.appendChild(o); });
    mk('填充模式', 'fill', fill);
    head.addEventListener('click', () => { detail.style.display = detail.style.display === 'none' ? 'grid' : 'none'; });
    play.addEventListener('click', e => { e.stopPropagation(); replayAnim(n); });
    del.addEventListener('click', e => {
      e.stopPropagation();
      layers.splice(i, 1);
      setAnims(n, layers);
      renderAnimList();
    });
    row.appendChild(head); row.appendChild(detail);
    list.appendChild(row);
  });
}

function replayAnim(n){
  if(!n) return;
  playLayers(n, getAnims(n), getAnimMode(n));
}
function stopAnim(n){
  if(!n) return;
  cancelLayers(n);
}

function buildEffectPicker(){
  const grid = $('effectGrid');
  Object.keys(KEYFRAMES).forEach(k => {
    const it = el('div','ep-item');
    it.innerHTML = '<b>' + (EFFECT_LABELS[k] || k) + '</b><span>' + k + '</span>';
    it.addEventListener('click', () => {
      $('effectPicker').classList.remove('open');
      if(selected){
        const layers = getAnims(selected);
        layers.push({effect:k, duration:1, easing:'ease', delay:0, iteration:1, direction:'normal', fill:'both'});
        setAnims(selected, layers);
        renderAnimList();
        toast('已添加动画「' + (EFFECT_LABELS[k] || k) + '」');
      }
    });
    grid.appendChild(it);
  });
  $('effectPicker').addEventListener('click', e => { if(e.target.id === 'effectPicker') $('effectPicker').classList.remove('open'); });
}

function bindAnimPanel(){
  $('animAdd').addEventListener('click', () => {
    if(selected) $('effectPicker').classList.add('open');
    else toast('请先在画布中选择一个组件');
  });
  $('animPreview').addEventListener('click', () => { if(selected) replayAnim(selected); });
  $('animStop').addEventListener('click', () => { if(selected) stopAnim(selected); });
  $('animClear').addEventListener('click', () => {
    if(!selected) return;
    selected.removeAttribute('data-anim');
    selected.removeAttribute('data-anim-mode');
    stopAnim(selected);
    mark(); renderAnimList();
  });
  $('animMode').addEventListener('change', () => {
    if(!selected) return;
    selected.dataset.animMode = $('animMode').value;
    applyAnims(selected);
    mark();
  });
  $('btnCustomAdd').addEventListener('click', () => {
    if(!selected){ toast('请先选择组件'); return; }
    let name = $('cf_name').value.trim();
    if(!name){ name = 'custom' + (Object.keys(customKeyframes).length + 1); }
    if(!/^[a-zA-Z][\w-]*$/.test(name)){ toast('名称需以字母开头，仅含字母数字-_'); return; }
    const from = { op:+$('cf_op0').value||0, tx:+$('cf_tx0').value||0, ty:+$('cf_ty0').value||0, sc:+$('cf_sc0').value||1, ro:+$('cf_ro0').value||0 };
    const to = { op:+$('cf_op1').value||1, tx:+$('cf_tx1').value||0, ty:+$('cf_ty1').value||0, sc:+$('cf_sc1').value||1, ro:+$('cf_ro1').value||0 };
    const tr = v => 'translate(' + v.tx + 'px,' + v.ty + 'px) scale(' + v.sc + ') rotate(' + v.ro + 'deg)';
    customKeyframes[name] = 'from{opacity:' + from.op + ';transform:' + tr(from) + '}to{opacity:' + to.op + ';transform:' + tr(to) + '}';
    syncKeyframes();
    const layers = getAnims(selected);
    layers.push({effect:name, duration:1, easing:'ease', delay:0, iteration:1, direction:'normal', fill:'both'});
    setAnims(selected, layers);
    renderAnimList();
    toast('已生成自定义动画「' + name + '」');
    mark();
  });
}

/* ---------- 页面面板 ---------- */
function syncPagePanel(){
  $('pageTitle').value = pageSettings.title;
  $('pageWidth').value = pageSettings.width;
  $('pageFont').value = pageSettings.font;
  $('bgColorPage').value = toHex(pageSettings.bgColor, '#ffffff');
  $('gradPage').value = pageSettings.gradient;
  $('bgImagePage').value = pageSettings.bgImage;
}

function bindPagePanel(){
  $('pageTitle').addEventListener('input', ()=>{ pageSettings.title = $('pageTitle').value || '我的网页'; mark(); });
  $('pageWidth').addEventListener('input', ()=>{
    const v = parseInt($('pageWidth').value, 10);
    if(v >= 320 && v <= 2000){ pageSettings.width = v; applyPageToCanvas(); mark(); }
  });
  $('pageFont').addEventListener('change', ()=>{ pageSettings.font = $('pageFont').value; applyPageToCanvas(); mark(); });
  $('bgColorPage').addEventListener('input', ()=>{ setPage({bgType: 'color', bgColor: $('bgColorPage').value}); });
  $('gradPage').addEventListener('input', ()=>{ setPage({bgType: $('gradPage').value.trim() ? 'gradient' : 'color', gradient: $('gradPage').value}); });
  $('bgImagePage').addEventListener('input', ()=>{
    const u = normalizeImgSrc($('bgImagePage').value);
    setPage({bgType: u ? 'image' : 'color', bgImage: u});
  });
}

/* ---------- 导出 ---------- */
/* HTML 美化格式化：缩进、属性换行、style 展开 */
function fmtEsc(v){
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function indentLines(str, depth){
  const d = '  '.repeat(depth);
  return str.split('\n').map(l => l ? d + l : '').join('\n');
}
function prettyHTML(root, startDepth){
  const VOID = new Set(['AREA','BASE','BR','COL','EMBED','HR','IMG','INPUT','LINK','META','PARAM','SOURCE','TRACK','WBR']);
  const IND = '  ';
  let out = '';
  const attrLines = n => {
    const lines = [];
    Array.from(n.attributes).forEach(a => {
      if(a.name === 'style' && a.value.indexOf(';') > -1){
        const st = a.value.split(';').map(s=>s.trim()).filter(Boolean);
        if(st.length > 1){
          lines.push('style="');
          st.forEach(s => lines.push(IND + IND + s + ';'));
          lines.push(IND + '"');
          return;
        }
      }
      lines.push(a.name + '="' + fmtEsc(a.value) + '"');
    });
    return lines;
  };
  const walk = (node, depth) => {
    const d = IND.repeat(depth);
    Array.from(node.childNodes).forEach(ch => {
      if(ch.nodeType === 3){
        const t = (ch.textContent || '').replace(/\s+/g,' ').trim();
        if(t) out += d + t + '\n';
        return;
      }
      if(ch.nodeType !== 1) return;
      const tag = ch.tagName.toLowerCase();
      const attrs = attrLines(ch);
      const openTag = '<' + tag + (attrs.length ? '\n' + attrs.map(a=>d+IND+a).join('\n') + '\n' + d : '') + '>';
      if(VOID.has(ch.tagName)){ out += d + openTag + '\n'; return; }
      const hasEl = Array.from(ch.childNodes).some(c => c.nodeType === 1);
      if(!hasEl){
        const t = (ch.textContent || '').replace(/\s+/g,' ').trim();
        out += d + openTag + (t ? fmtEsc(t) : '') + '</' + tag + '>\n';
        return;
      }
      out += d + openTag + '\n';
      walk(ch, depth + 1);
      out += d + '</' + tag + '>\n';
    });
  };
  walk(root, startDepth || 0);
  return out.trim();
}

/* CSS 格式化：每条规则展开、声明缩进、@keyframes 分帧换行，保证可读性 */
function formatCss(css){
  const norm = d => {
    d = d.trim();
    if(!d) return '';
    const ci = d.indexOf(':');
    if(ci > -1) d = d.slice(0, ci).trim() + ': ' + d.slice(ci + 1).trim();
    return d;
  };
  const lines = [];
  css.split('\n').forEach(line => {
    line = line.trim();
    if(!line) return;
    if(line.indexOf('/*') === 0){ lines.push(line); return; }
    const km = line.match(/^(@keyframes\s+[\w-]+)\{(.*)\}$/);
    if(km){
      lines.push(km[1] + ' {');
      km[2].split('}').forEach(frame => {
        const fm = frame.match(/^([\d.,%\w-]+)\{(.*)$/);
        if(fm){
          lines.push('  ' + fm[1] + ' {');
          fm[2].split(';').forEach(d => {
            d = norm(d);
            if(d) lines.push('    ' + d + ';');
          });
          lines.push('  }');
        }
      });
      lines.push('}');
      return;
    }
    const rb = line.indexOf('{');
    if(rb > -1 && line.charAt(line.length - 1) === '}'){
      const sel = line.slice(0, rb).trim();
      const body = line.slice(rb + 1, line.length - 1);
      lines.push(sel + ' {');
      body.split(';').forEach(d => {
        d = norm(d);
        if(d) lines.push('  ' + d + ';');
      });
      lines.push('}');
      return;
    }
    lines.push(line);
  });
  return lines.join('\n');
}

/* JS 动画映射格式化：按缩进输出 { '.el-1': '...' } 或 { '.el-1': { mode, layers } } */
function formatAnimsMap(anims, indent){
  const keys = Object.keys(anims);
  if(!keys.length) return '{}';
  const inner = keys.map((k, i) => {
    const raw = JSON.stringify(anims[k], null, 2);
    const ind = indent + indent;
    const val = raw.split('\n').map((l, j) => j === 0 ? l : ind + l).join('\n');
    return ind + JSON.stringify(k) + ': ' + val + (i < keys.length - 1 ? ',' : '');
  }).join('\n');
  return '{\n' + inner + '\n' + indent + '}';
}

/* 生成导出所需的各个部分：mode='inline' 内联样式；mode='class' 样式进 CSS、动画进 JS（选择器关联） */
const PAGE_ID = 'page';
function buildExportParts(mode){
  const clone = canvas.cloneNode(true);
  clone.querySelectorAll('#selBox, #dropLine, #snapV, #snapH, .dsh-hint').forEach(n => n.remove());
  const used = new Set();
  const anims = {};
  const rules = [];
  let idx = 0;
  const clean = n => {
    if(n.classList && n.classList.contains('dsh-hint')){ n.remove(); return; }
    /* 网格单元格：转为导出可见的小容器（保留结构，去掉编辑器类名） */
    if(n.classList && n.classList.contains('dsh-cell')){
      n.setAttribute('style', 'min-height:40px;position:relative;border:1px dashed #e2e8f0;border-radius:4px');
      n.removeAttribute('class');
    }
    /* 按钮跳转链接：导出时转换为 <a>，点击即可跳转 */
    if(n.tagName === 'BUTTON' && n.dataset && n.dataset.href){
      const a = document.createElement('a');
      a.href = n.dataset.href;
      if(n.getAttribute('style')) a.setAttribute('style', n.getAttribute('style'));
      while(n.firstChild) a.appendChild(n.firstChild);
      n.replaceWith(a);
      clean(a);
      return;
    }
    n.classList.remove('dsh-el','dsh-box','dsh-selected');
    let animShorthand = '';
    let layersData = null;
    let layersMode = 'parallel';
    if(n.dataset && n.dataset.anim){
      const layers = getAnims(n);
      const amode = n.dataset.animMode === 'sequence' ? 'sequence' : 'parallel';
      animShorthand = layers.length ? animsToCss(layers, amode) : '';
      layers.forEach(l => used.add(l.effect));
      layersData = layers;
      layersMode = amode;
      n.removeAttribute('data-anim');
    }
    n.removeAttribute('data-anim-mode');
    n.removeAttribute('data-wrapped-id');
    n.removeAttribute('data-name');
    n.removeAttribute('data-id'); n.removeAttribute('data-type');
    n.removeAttribute('contenteditable'); n.removeAttribute('draggable');
    if(n.tagName === 'IMG' && !n.getAttribute('src')) n.setAttribute('src', placeholderImg());
    if(n.tagName === 'IMG' && !n.getAttribute('alt')) n.setAttribute('alt','');
    if(mode === 'class'){
      idx++;
      const cls = 'el-' + idx;
      const st = n.getAttribute('style') || '';
      n.setAttribute('class', cls);
      n.removeAttribute('style');
      if(st) rules.push('#' + PAGE_ID + ' .' + cls + '{' + st + '}');
      if(layersData && layersData.length) anims['.' + cls] = { mode: layersMode, layers: layersData };
    } else {
      if(animShorthand) n.style.animation = animShorthand;
      if(n.getAttribute('style') === '') n.removeAttribute('style');
      if(n.classList.length === 0) n.removeAttribute('class');
    }
    Array.from(n.children).forEach(clean);
  };
  /* 只处理画布内容的子节点，画布根节点本身不作为组件导出 */
  Array.from(clone.children).forEach(clean);
  let kf = '';
  used.forEach(ef => {
    const css = customKeyframes[ef] || KEYFRAMES[ef];
    if(css) kf += '@keyframes ' + ef + '{' + css + '}\n';
  });
  const body = [];
  if(pageSettings.bgType === 'color') body.push('background-color:' + pageSettings.bgColor);
  if(pageSettings.bgType === 'gradient'){ body.push('background-color:' + pageSettings.bgColor); body.push('background-image:' + pageSettings.gradient); }
  if(pageSettings.bgType === 'image'){
    body.push('background-color:' + pageSettings.bgColor);
    body.push('background-image:url("' + pageSettings.bgImage + '")');
    body.push('background-size:cover;background-position:center;background-repeat:no-repeat');
  }
  if(pageSettings.font) body.push('font-family:' + pageSettings.font);
  let css =
    '/* ===== 页面样式 ===== */\n' +
    '*{box-sizing:border-box}\n' +
    'html,body{margin:0;padding:0}\n' +
    'body{min-height:100vh;' + body.join(';') + '}\n' +
    'img{max-width:100%}\n' +
    (kf ? kf : '');
  const w = Math.min(pageSettings.width, 2000);
  const ch = parseInt(canvas.style.height, 10) || 720;
  let wrapper;
  if(mode === 'class'){
    rules.push('#' + PAGE_ID + '{position:relative;width:' + w + 'px;max-width:100%;margin:0 auto;padding:44px;height:' + ch + 'px}');
    css += '\n/* ===== 组件样式（选择器关联） ===== */\n' + rules.join('\n') + '\n';
    wrapper = '<div id="' + PAGE_ID + '">\n' + prettyHTML(clone, 1) + '\n</div>';
  } else {
    wrapper = '<div\n  style="\n    position:relative;\n    width:' + w + 'px;\n    max-width:100%;\n    margin:0 auto;\n    padding:44px;\n    height:' + ch + 'px;\n  "\n>\n' + prettyHTML(clone, 1) + '\n</div>';
  }
  css = formatCss(css);
  return { title: escapeHtml(pageSettings.title), css, body: wrapper, anims, usedEffects: Array.from(used) };
}

function buildExportHTML(){
  const p = buildExportParts('inline');
  return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <title>' + p.title + '</title>\n' +
    '  <style>\n' + indentLines(p.css, 1) + '\n  </style>\n' +
    '</head>\n<body>\n' + p.body + '\n</body>\n</html>';
}

/* 页面脚本：动画由 JS 通过选择器应用（WAAPI 组合，transform 叠加合成，支持延迟跟随） */
function buildScriptJs(anims, usedEffects){
  const kfMap = {};
  usedEffects.forEach(ef => {
    const css = customKeyframes[ef] || KEYFRAMES[ef];
    if(css) kfMap[ef] = css;
  });
  const lines = [];
  lines.push('/* ===== 页面脚本：动画由 JS 通过选择器应用（支持组合与延迟跟随） ===== */');
  lines.push('(function () {');
  lines.push('  // 1. 关键帧与动画配置');
  lines.push('  var KF = ' + formatAnimsMap(kfMap, '  ') + ';');
  lines.push('  var ANIMS = ' + formatAnimsMap(anims, '  ') + ';');
  lines.push('  // 2. 解析 CSS 关键帧字符串为 WAAPI keyframes');
  lines.push('  function parseKeyframes(css) {');
  lines.push('    var frames = [];');
  lines.push('    css.split("}").forEach(function (part) {');
  lines.push('      var m = part.match(/^([\\d.,%\\w-]+)\\{(.*)$/);');
  lines.push('      if (!m) return;');
  lines.push('      var decls = {};');
  lines.push('      m[2].split(";").forEach(function (d) {');
  lines.push('        d = d.trim();');
  lines.push('        var ci = d.indexOf(":");');
  lines.push('        if (ci > -1) decls[d.slice(0, ci).trim()] = d.slice(ci + 1).trim();');
  lines.push('      });');
  lines.push('      m[1].split(",").forEach(function (sel) {');
  lines.push('        sel = sel.trim();');
  lines.push('        var offset = sel === "from" ? 0 : sel === "to" ? 1 : parseFloat(sel) / 100;');
  lines.push('        var f = Object.assign({}, decls);');
  lines.push('        if (!isNaN(offset)) f.offset = offset;');
  lines.push('        frames.push(f);');
  lines.push('      });');
  lines.push('    });');
  lines.push('    frames.sort(function (a, b) { return (a.offset || 0) - (b.offset || 0); });');
  lines.push('    return frames;');
  lines.push('  }');
  lines.push('  // 3. 播放组合动画：transform 采用 add 合成（多个效果真正叠加）；');
  lines.push('  //    依次播放时延迟自动累加，实现「动画1 延迟跟随 动画2」');
  lines.push('  function play(el, cfg) {');
  lines.push('    if (!el || !cfg || !cfg.layers || typeof el.animate !== "function") return;');
  lines.push('    var mode = cfg.mode || "parallel";');
  lines.push('    var acc = 0;');
  lines.push('    cfg.layers.forEach(function (l) {');
  lines.push('      var css = KF[l.effect];');
  lines.push('      if (!css) return;');
  lines.push('      var kfs = parseKeyframes(css);');
  lines.push('      var duration = (parseFloat(l.duration) || 0) * 1000;');
  lines.push('      var delay = (parseFloat(l.delay) || 0) * 1000;');
  lines.push('      if (mode === "sequence") { delay = acc + delay; acc += duration; }');
  lines.push('      var opts = { duration: duration, delay: delay, easing: l.easing || "ease",');
  lines.push('        iterations: l.iteration === "infinite" ? Infinity : (parseInt(l.iteration, 10) || 1),');
  lines.push('        direction: l.direction || "normal", fill: l.fill || "both" };');
  lines.push('      var props = {};');
  lines.push('      kfs.forEach(function (f) { Object.keys(f).forEach(function (p) { if (p !== "offset") props[p] = 1; }); });');
  lines.push('      Object.keys(props).forEach(function (prop) {');
  lines.push('        var pf = kfs.map(function (f) { var o = {}; o[prop] = f[prop]; if (f.offset !== undefined) o.offset = f.offset; return o; });');
  lines.push('        try {');
  lines.push('          el.animate(pf, Object.assign({}, opts, { composite: prop === "transform" ? "add" : "replace" }));');
  lines.push('        } catch (e) {');
  lines.push('          try { el.animate(pf, opts); } catch (e2) {}');
  lines.push('        }');
  lines.push('      });');
  lines.push('    });');
  lines.push('  }');
  lines.push('  // 4. 按选择器应用动画');
  lines.push('  Object.keys(ANIMS).forEach(function (sel) {');
  lines.push('    play(document.querySelector(sel), ANIMS[sel]);');
  lines.push('  });');
  lines.push('  // 5. 平滑滚动到页面内锚点');
  lines.push('  document.addEventListener(\'click\', function (e) {');
  lines.push('    var a = e.target.closest ? e.target.closest(\'a[href^="#"]\') : null;');
  lines.push('    if (a) {');
  lines.push('      var t = document.querySelector(a.getAttribute(\'href\'));');
  lines.push('      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: \'smooth\' }); }');
  lines.push('    }');
  lines.push('  });');
  lines.push('})();');
  return lines.join('\n') + '\n';
}

/* 分离导出：index.html + style.css + script.js（样式用选择器，动画由 JS 应用） */
function buildExportFiles(){
  const p = buildExportParts('class');
  const index = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <title>' + p.title + '</title>\n' +
    '  <link rel="stylesheet" href="style.css">\n' +
    '</head>\n<body>\n' + p.body + '\n' +
    '  <script src="script.js"></' + 'script>\n' +
    '</body>\n</html>';
  return { 'index.html': index, 'style.css': p.css, 'script.js': buildScriptJs(p.anims, p.usedEffects) };
}

/* ZIP（STORE 方式）打包 */
function crc32(u8){
  if(!crc32.table){
    crc32.table = [];
    for(let n=0;n<256;n++){
      let c = n;
      for(let k=0;k<8;k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      crc32.table[n] = c >>> 0;
    }
  }
  let c = 0xFFFFFFFF;
  for(let i=0;i<u8.length;i++) c = crc32.table[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function str2u8(s){ return new TextEncoder().encode(s); }
function makeZip(files){
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  const dosTime = 0x6000, dosDate = 0x0021;
  files.forEach(f => {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const lh = new Uint8Array(30);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0x0800, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, dosTime, true);
    dv.setUint16(12, dosDate, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, f.data.length, true);
    dv.setUint32(22, f.data.length, true);
    dv.setUint16(26, name.length, true);
    dv.setUint16(28, 0, true);
    parts.push(lh, name, f.data);
    const ch = new Uint8Array(46);
    const cvd = new DataView(ch.buffer);
    cvd.setUint32(0, 0x02014b50, true);
    cvd.setUint16(4, 20, true);
    cvd.setUint16(6, 20, true);
    cvd.setUint16(8, 0x0800, true);
    cvd.setUint16(10, 0, true);
    cvd.setUint16(12, dosTime, true);
    cvd.setUint16(14, dosDate, true);
    cvd.setUint32(16, crc, true);
    cvd.setUint32(20, f.data.length, true);
    cvd.setUint32(24, f.data.length, true);
    cvd.setUint16(28, name.length, true);
    cvd.setUint16(30, 0, true);
    cvd.setUint16(32, 0, true);
    cvd.setUint16(34, 0, true);
    cvd.setUint16(36, 0, true);
    cvd.setUint32(38, 0, true);
    cvd.setUint32(42, offset, true);
    central.push(ch, name);
    offset += lh.length + name.length + f.data.length;
  });
  const cdSize = central.reduce((a,b)=>a+b.length,0);
  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(4, 0, true);
  edv.setUint16(6, 0, true);
  edv.setUint16(8, files.length, true);
  edv.setUint16(10, files.length, true);
  edv.setUint32(12, cdSize, true);
  edv.setUint32(16, offset, true);
  edv.setUint16(20, 0, true);
  const total = parts.concat(central, [eocd]);
  const size = total.reduce((a,b)=>a+b.length,0);
  const out = new Uint8Array(size);
  let p = 0;
  total.forEach(u => { out.set(u, p); p += u.length; });
  return out;
}

/* 导出弹窗状态 */
let expMode = 'single';
let expFile = 'index.html';
function expFilesMap(){ return buildExportFiles(); }
function currentExportCode(){
  if(expMode === 'multi') return expFilesMap()[expFile] || '';
  return buildExportHTML();
}
function updateExpUI(){
  const multi = expMode === 'multi';
  $('expTabs').classList.toggle('show', multi);
  $('expNote').textContent = multi
    ? '已拆分为 index.html / style.css / script.js 三个文件，点击上方标签查看；「下载文件」将打包为 ZIP，解压后即为独立文件夹。'
    : '以下为格式化的完整独立 HTML 代码，可直接保存为 .html 文件在浏览器中打开，或嵌入到任意项目。';
  document.querySelectorAll('.exp-tab').forEach(b => b.classList.toggle('active', b.dataset.file === expFile));
  $('exportCode').value = currentExportCode();
}
function openExport(){
  expMode = 'single';
  expFile = 'index.html';
  document.querySelectorAll('.exp-mode input').forEach(r => { r.checked = (r.value === 'single'); });
  updateExpUI();
  $('exportModal').classList.add('open');
}
function closeExport(){ $('exportModal').classList.remove('open'); }
function downloadHTML(){
  const title = (pageSettings.title || 'page').replace(/[\\/:*?"<>|]/g,'_');
  const a = document.createElement('a');
  if(expMode === 'multi'){
    const files = expFilesMap();
    const zip = makeZip([
      { name:'index.html', data: str2u8(files['index.html']) },
      { name:'style.css', data: str2u8(files['style.css']) },
      { name:'script.js', data: str2u8(files['script.js']) }
    ]);
    a.href = URL.createObjectURL(new Blob([zip], { type:'application/zip' }));
    a.download = title + '.zip';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
    toast('已下载 ' + a.download + '（解压后为独立文件夹）');
    return;
  }
  a.href = URL.createObjectURL(new Blob([buildExportHTML()], { type:'text/html;charset=utf-8' }));
  a.download = title + '.html';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
  toast('已下载 ' + a.download);
}
function copyCode(){
  const txt = $('exportCode').value;
  const done = () => toast('代码已复制到剪贴板');
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt, done));
  } else fallbackCopy(txt, done);
}
function fallbackCopy(txt, done){
  $('exportCode').select(); document.execCommand('copy'); done();
}
function openPreview(){
  $('previewFrame').srcdoc = buildExportHTML();
  $('previewOverlay').classList.add('open');
}
function closePreview(){ $('previewOverlay').classList.remove('open'); $('previewFrame').srcdoc = ''; }

function bindToolbar(){
  $('btnExport').addEventListener('click', openExport);
  $('btnCloseExport').addEventListener('click', closeExport);
  $('exportModal').addEventListener('click', e => { if(e.target.id === 'exportModal') closeExport(); });
  $('btnCopyCode').addEventListener('click', copyCode);
  $('btnDownload').addEventListener('click', downloadHTML);
  $('btnPreview').addEventListener('click', openPreview);
  $('btnClosePreview').addEventListener('click', closePreview);
  $('previewOverlay').addEventListener('click', e => { if(e.target.id === 'previewOverlay') closePreview(); });
  /* 导出模式：单一 HTML / HTML+CSS+JS 分离 */
  document.querySelectorAll('.exp-mode input').forEach(r => {
    r.addEventListener('change', () => {
      if(r.checked){ expMode = r.value; updateExpUI(); }
    });
  });
  document.querySelectorAll('.exp-tab').forEach(b => {
    b.addEventListener('click', () => { expFile = b.dataset.file; updateExpUI(); });
  });
  /* 磁吸吸附开关 */
  $('btnSnap').addEventListener('click', () => {
    snapEnabled = !snapEnabled;
    $('btnSnap').classList.toggle('active', snapEnabled);
    $('btnSnap').textContent = snapEnabled ? '🧲 磁吸吸附: 开' : '🧲 磁吸吸附: 关';
    toast(snapEnabled ? '已开启磁吸吸附：拖动组件靠近其它组件时自动对齐' : '已关闭磁吸吸附');
  });
  $('btnClear').addEventListener('click', ()=>{
    if(!confirm('确定清空画布上的所有内容吗？')) return;
    deselect();
    canvas.querySelectorAll('.dsh-el').forEach(n=>n.remove());
    removeHint();
    mark();
    toast('画布已清空');
  });
  $('btnHelp').addEventListener('click', ()=>$('helpModal').classList.add('open'));
  $('btnCloseHelp').addEventListener('click', ()=>$('helpModal').classList.remove('open'));
  $('helpModal').addEventListener('click', e => { if(e.target.id === 'helpModal') $('helpModal').classList.remove('open'); });
}

/* ---------- 快捷键 ---------- */
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    closeContextMenu();
    if($('pageSettingsModal').classList.contains('open')){ $('pageSettingsModal').classList.remove('open'); return; }
    if($('exportModal').classList.contains('open')){ closeExport(); return; }
    if($('previewOverlay').classList.contains('open')){ closePreview(); return; }
    return;
  }
  if(isEditing()) return;
  if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if((e.key === 'Delete' || e.key === 'Backspace') && selected){
    e.preventDefault();
    if(selected.classList.contains('dsh-cell')){ selected.innerHTML = ''; mark(); }
    else removeEl(selected);
    return;
  }
  if(selected && isAbs(selected)){
    const step = e.shiftKey ? 10 : 1;
    const l = selected.style.left ? parseFloat(selected.style.left) : 0;
    const t = selected.style.top ? parseFloat(selected.style.top) : 0;
    if(e.key === 'ArrowLeft'){ selected.style.left = (l - step) + 'px'; mark(); }
    if(e.key === 'ArrowRight'){ selected.style.left = (l + step) + 'px'; mark(); }
    if(e.key === 'ArrowUp'){ selected.style.top = (t - step) + 'px'; mark(); }
    if(e.key === 'ArrowDown'){ selected.style.top = (t + step) + 'px'; mark(); }
    updateSelBox();
  }
});

/* ---------- 本地保存 ---------- */
const SAVE_KEY = 'dsh-page-builder-v1';
let saveTimer = null;

/* 元素相对画布内容区的坐标：绝对/相对定位按 style 值沿父链累加；流式元素回退到 offsetTop/offsetLeft */
function absPos(el){
  let top = 0, left = 0, n = el, flow = false;
  while(n && n !== canvas){
    const pos = n.style.position;
    if(pos === 'absolute' || pos === 'relative'){
      top += parseFloat(n.style.top) || 0;
      left += parseFloat(n.style.left) || 0;
    } else {
      flow = true;
      break;
    }
    n = n.parentNode;
  }
  if(flow){
    let t2 = 0, l2 = 0, m = el;
    while(m && m !== canvas){ t2 += m.offsetTop; l2 += m.offsetLeft; m = m.offsetParent; }
    return { top: t2, left: l2 };
  }
  return { top, left };
}
/* 画布高度自适应：内容超出时自动增高，保证画布可滚动 */
function fitCanvasHeight(){
  let maxBottom = 0;
  canvas.querySelectorAll('.dsh-el').forEach(n => {
    const p = absPos(n);
    const b = p.top + n.offsetHeight;
    if(b > maxBottom) maxBottom = b;
  });
  canvas.style.height = Math.max(720, maxBottom + 120) + 'px';
  updateSelBox();
}

function mark(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 500);
  fitCanvasHeight();
  renderOutline();
  $('saveStatus').textContent = '● 保存中…';
  $('saveStatus').style.color = '#fde68a';
}
/* 只序列化页面内容，排除编辑器浮层（选择框 / 插入线 / 吸附参考线 / 提示） */
function serializeContent(){
  return Array.from(canvas.children)
    .filter(c => ['selBox','dropLine','snapV','snapH'].indexOf(c.id) === -1 && !(c.classList && c.classList.contains('dsh-hint')))
    .map(c => c.outerHTML).join('');
}
function restoreContent(html){
  Array.from(canvas.children).forEach(c => {
    if(['selBox','dropLine','snapV','snapH'].indexOf(c.id) === -1) c.remove();
  });
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  while(tpl.content.firstChild) canvas.insertBefore(tpl.content.firstChild, selBox);
}
function saveState(){
  try{
    const data = { html: serializeContent(), page: pageSettings, custom: customKeyframes, theme: themeSettings, themePreset: themePresetName };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }catch(e){}
  $('saveStatus').textContent = '✓ 已自动保存';
  $('saveStatus').style.color = '';
}
function loadState(){
  try{
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!d) return false;
    restoreContent(d.html || '');
    pageSettings = Object.assign({}, DEFAULT_PAGE, d.page || {});
    customKeyframes = d.custom || {};
    themeSettings = Object.assign({}, THEME_DEFAULTS, d.theme || {});
    themePresetName = d.themePreset || '';
    applyTheme();
    return true;
  }catch(e){ return false; }
}
function restoreAfterLoad(){
  canvas.querySelectorAll('.dsh-el').forEach(n => {
    if(n.tagName !== 'IMG' && n.tagName !== 'INPUT' && n.tagName !== 'A') n.draggable = true;
    if(n.dataset && n.dataset.anim) applyAnims(n);
    if(n.dataset && n.dataset.type === 'grid') syncGridCells(n);
  });
  const hint = canvas.querySelector('.dsh-hint');
  if(hint && canvas.querySelector('.dsh-el')) hint.remove();
}

/* ---------- 初始化 ---------- */
function init(){
  buildPalette();
  buildSelBox();
  bindStylePanel();
  bindAnimPanel();
  bindPagePanel();
  bindPageSettings();
  bindToolbar();
  buildEffectPicker();
  syncKeyframes();
  applyTheme();
  const loaded = loadState();
  if(loaded){
    restoreAfterLoad();
  } else {
    removeHint();
  }
  applyPageToCanvas();
  syncPagePanel();
  syncThemeInputs();
  deselect();
  fitCanvasHeight();
  saveState();
  $('saveStatus').textContent = '✓ 已自动保存';
}
document.addEventListener('DOMContentLoaded', init);
