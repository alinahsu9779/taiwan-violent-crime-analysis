/* ==================== 1. 投影片翻頁控制邏輯 ==================== */
const slides = Array.from(document.querySelectorAll('.slide'));
const navPills = document.getElementById('navPills');
const progressBar = document.getElementById('progressBar');
const pageIndicator = document.getElementById('pageIndicator');
const tooltip = document.getElementById('tooltip');
let currentSlide = 0;

slides.forEach(function(slide, idx) {
  const pill = document.createElement('button');
  pill.className = 'nav-pill' + (idx === 0 ? ' active' : '');
  pill.textContent = slide.dataset.title;
  pill.onclick = function() { goToSlide(idx); };
  navPills.appendChild(pill);
});

function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;
  slides[currentSlide].classList.remove('active');
  navPills.children[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  navPills.children[currentSlide].classList.add('active');
  updateHUD();
  renderAllCharts();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function updateHUD() {
  const pct = ((currentSlide + 1) / slides.length) * 100;
  progressBar.style.width = pct + '%';
  pageIndicator.textContent = (currentSlide + 1) + ' / ' + slides.length;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function() {});
  } else {
    document.exitFullscreen().catch(function() {});
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
  if (e.key.toLowerCase() === 'f') { toggleFullscreen(); }
});

/* ==================== 2. 滑鼠提示框與 SVG 建立輔助函式 ==================== */
function showTip(evt, titleText, line1, line2) {
  tooltip.textContent = '';
  const strong = document.createElement('strong');
  strong.textContent = titleText;
  tooltip.appendChild(strong);
  tooltip.appendChild(document.createElement('br'));
  tooltip.appendChild(document.createTextNode(line1));
  if (line2) {
    tooltip.appendChild(document.createElement('br'));
    tooltip.appendChild(document.createTextNode(line2));
  }
  tooltip.style.opacity = '1';
  tooltip.style.left = Math.min(evt.clientX + 14, window.innerWidth - 220) + 'px';
  tooltip.style.top = Math.max(evt.clientY - 38, 12) + 'px';
}
function hideTip() { tooltip.style.opacity = '0'; }

const SVG_NS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
function createSvgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el;
}


/* ==================== 3. 報告數據資料庫（改數字來這裡改） ==================== */
const years10 = new Array('2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025');

// 第 02 章：暴力犯罪發生數 vs 破獲數（2015–2025）
const violentOccur = new Array(1956, 1627, 1260, 993, 859, 707, 598, 499, 442, 374, 503);
const violentClear = new Array(2008, 1656, 1293, 995, 898, 737, 597, 497, 451, 368, 497);

// 第 03 章：故意殺人發生數 vs 破獲數（2015–2025）
const homicideOccur = new Array(442, 405, 399, 323, 302, 238, 212, 174, 123, 136, 158);
const homicideClear = new Array(441, 398, 395, 318, 314, 243, 209, 175, 123, 131, 159);

// 第 04 章：故意殺人佔整體暴力犯罪比重（%）
const homicideRatio = new Array(22.60, 24.90, 31.70, 32.50, 35.20, 33.70, 35.50, 34.90, 27.80, 36.40, 31.40);

// 第 05 章：故意殺人兩造關係人數（2019–2023）
const relYears = new Array('2019', '2020', '2021', '2022', '2023');
const relKnown = new Array(173, 127, 107, 102, 76);
const relStranger = new Array(70, 67, 55, 37, 20);

// 第 06 章：性別視角切換資料庫（2019–2023）
const genderData = {
  female: {
    color: '#EF4444',
    relTitle: '女性被害者：兩造關係佔比（%）',
    locTitle: '女性被害者：案發地點佔比（%）',
    knownPct: new Array(92.10, 82.00, 83.00, 88.70, 93.10),
    strangerPct: new Array(8.00, 18.00, 17.00, 11.30, 6.90),
    homePct: new Array(57.20, 49.20, 61.70, 75.00, 82.80),
    nonHomePct: new Array(42.90, 50.80, 38.30, 25.00, 17.20),
    heading: '女性被害者核心洞察',
    items: [
      { title: '案發地點：高度集中於住宅', desc: '2022–2023 年約 8 成發生在住宅內（2023 年達 82.80%），最危險的地方反而是「家」。' },
      { title: '嫌犯關係：絕大多數為熟人', desc: '歷年 82%–93% 為認識的親密伴侶或家屬，陌生人隨機攻擊佔比極低。' },
      { title: '學理解讀：日常活動理論', desc: '私領域內的親密關係衝突與家暴防治，是守護女性生命安全的關鍵。' }
    ]
  },
  male: {
    color: '#3B82F6',
    relTitle: '男性被害者：兩造關係佔比（%）',
    locTitle: '男性被害者：案發地點佔比（%）',
    knownPct: new Array(57.69, 55.63, 56.10, 69.51, 71.64),
    strangerPct: new Array(42.31, 44.37, 43.90, 30.49, 28.36),
    homePct: new Array(39.10, 32.39, 39.02, 57.32, 65.67),
    nonHomePct: new Array(60.90, 67.61, 60.98, 42.68, 34.33),
    heading: '男性被害者核心洞察',
    items: [
      { title: '2019–2021：非住宅外部衝突較高', desc: '約 6 成以上發生在非住宅場域，涉及陌生人或結怨者的比例超過 4 成。' },
      { title: '2022–2023：重心轉向住宅內熟人', desc: '住宅內案件升至 57%–66%，熟人涉案比例同步升至 7 成左右，結構出現明顯轉變。' },
      { title: '研究解讀：被害特徵轉型', desc: '近年男性命案特徵逐步向私領域熟人衝突集中，非住宅場域衝突比例相對下降。' }
    ]
  }
};

let activeGender = 'female';

function switchGender(gender) {
  activeGender = gender;
  document.getElementById('btnFemale').classList.toggle('active', gender === 'female');
  document.getElementById('btnMale').classList.toggle('active', gender === 'male');
  renderGenderSection();
}

/* ==================== 4. 雙長條對比圖（教室大螢幕放大版 + 防重疊 + 逐行詳細註解） ==================== */
/**
 * 繪製雙長條對比圖（用於呈現「發生數 vs. 破獲數」等兩組數據的歷年對照）
 * @param {string} containerId - 網頁上要放入圖表的 HTML 容器 ID
 * @param {Array<string>} labels - X 軸的年份陣列（例如 ['2015', '2016', ...]）
 * @param {Array<number>} s1 - 第一組數值陣列（藍色長條：發生數）
 * @param {Array<number>} s2 - 第二組數值陣列（橘色長條：破獲數）
 * @param {number} maxY - Y 軸的最大刻度上限（例如 2200）
 * @param {boolean} showReformLine - 是否在 2024 與 2025 年之間繪製「2024/09 統計改制」虛線
 */
function renderGroupedBarChart(containerId, labels, s1, s2, maxY, showReformLine) {
  // 1. 取得網頁上負責放圖表的 DOM 容器元素，若找不到則提前結束函式避免程式報錯
  const el = document.getElementById(containerId);
  if (!el) return;

  // 清空容器內既有的圖表內容（確保視窗縮放或切換分頁重繪時，不會重複疊加多張圖）
  el.textContent = '';

  // 2. 動態抓取容器當下的實際像素寬高；若容器尚未完全展開，則套用預設尺寸 860x340
  const W = el.clientWidth || 860;
  const H = el.clientHeight || 340;

  // 3. 設定圖表四周留白內距（Padding）：
  // padL 加寬至 62，避免放大後的 Y 軸四位數（如 2,200）被左側切掉
  // padT 加高至 42，預留足夠空間給頂部的「2024/09 統計改制」與長條頂端數字
  const padL = 62, padR = 28, padT = 42, padB = 38;

  // 計算扣除四周內距後，真正用來繪製長條的「有效畫布寬度 (plotW)」與「有效畫布高度 (plotH)」
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // 計算每一個年份群組（包含藍、橘兩根長條與左右間距）所佔的水平寬度
  const groupW = plotW / labels.length;
  // 計算單根長條的寬度：取群組寬度的 34%，並限制最大不超過 24px（避免寬螢幕時長條過粗）
  const barW = Math.min(groupW * 0.34, 24);

  // 4. 建立外層 SVG 畫布，透過 viewBox 屬性讓整張圖表能隨螢幕比例等比例縮放
  const svg = createSvgEl('svg', { width: '100%', height: '100%', viewBox: '0 0 ' + W + ' ' + H });

  // 5. 繪製背景水平參考虛線與左側 Y 軸刻度數字（i 從 0 到 4，共切成 4 等份、畫出 5 條水平線）
  for (let i = 0; i <= 4; i++) {
    // 計算該刻度線代表的實際數值（例如 maxY=2200 時，依序為 0、550、1100、1650、2200）
    const val = Math.round((maxY / 4) * i);
    // 計算該水平線在 SVG 上的 Y 座標（SVG 的 Y 軸由上往下遞增，因此需用底部座標往上減）
    const y = padT + plotH - (plotH * i) / 4;

    // 繪製半透明灰色虛線（stroke-dasharray: '4,4' 代表畫 4px 實線、空 4px 透明）
    svg.appendChild(createSvgEl('line', {
      x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: 'rgba(255,255,255,0.1)', 'stroke-dasharray': '4,4'
    }));

    // 繪製左側 Y 軸刻度文字（放大至 13px，text-anchor: 'end' 讓數字緊貼 Y 軸靠右對齊）
    const t = createSvgEl('text', {
      x: padL - 10, y: y + 5, fill: '#94A3B8', 'font-size': '13', 'text-anchor': 'end'
    });
    // 使用 toLocaleString() 自動為四位數加上千分位逗號（例如 2200 -> 2,200）
    t.textContent = val.toLocaleString();
    svg.appendChild(t);
  }

  // 6. 條件式繪製「2024/09 統計改制」垂直警示虛線
  // 因為索引 0~9 共 10 個年份（2015~2024），padL + groupW * 10 剛好落在 2024 與 2025 的正中間
  if (showReformLine) {
    const reformX = padL + groupW * 10;

    // 繪製垂直琥珀黃色虛線，標示統計基準變更的時間分界點
    svg.appendChild(createSvgEl('line', {
      x1: reformX, y1: padT - 10, x2: reformX, y2: padT + plotH,
      stroke: '#F59E0B', 'stroke-width': '1.8', 'stroke-dasharray': '5,4'
    }));

    // 在虛線左上方加上「2024/09 統計改制」說明文字（放大至 14px，確保大螢幕投影清晰）
    const rt = createSvgEl('text', {
      x: reformX - 8, y: padT - 15, fill: '#FBBF24', 'font-size': '14', 'font-weight': '700', 'text-anchor': 'end'
    });
    rt.textContent = '2024/09 統計改制';
    svg.appendChild(rt);
  }

  // 7. 逐一走訪每個年度，繪製「藍色長條」、「橘色長條」以及各自上方的數值標籤
  labels.forEach(function(yr, idx) {
    // 計算該年度群組的水平中心點 X 座標（藍條與橘條的對稱中線）
    const cx = padL + groupW * idx + groupW / 2;

    // 依數值與最大值（maxY）的比例，換算兩根長條的像素高度（h1, h2）與頂端起點 Y 座標（y1, y2）
    const h1 = (s1[idx] / maxY) * plotH;
    const h2 = (s2[idx] / maxY) * plotH;
    const y1 = padT + plotH - h1;
    const y2 = padT + plotH - h2;

    // 7-1. 建立左側藍色長條（發生數）：從中心線往左推 barW + 2px，並加上 rx=3 圓角效果
    const r1 = createSvgEl('rect', {
      x: cx - barW - 2, y: y1, width: barW, height: h1, rx: '3', fill: '#3B82F6'
    });
    // 綁定滑鼠移入／移動事件：觸發全站共用的懸浮提示框（Tooltip），顯示該年完整件數
    r1.onmousemove = function(e) {
      showTip(e, yr + ' 年', '發生數：' + s1[idx].toLocaleString() + ' 件', '破獲數：' + s2[idx].toLocaleString() + ' 件');
    };
    // 滑鼠移出長條時隱藏提示框
    r1.onmouseleave = hideTip;
    svg.appendChild(r1);

    // 7-2. 建立右側橘色長條（破獲數）：從中心線往右推 2px，與藍條之間保留 4px 中間縫隙
    const r2 = createSvgEl('rect', {
      x: cx + 2, y: y2, width: barW, height: h2, rx: '3', fill: '#E86F3A'
    });
    r2.onmousemove = function(e) {
      showTip(e, yr + ' 年', '發生數：' + s1[idx].toLocaleString() + ' 件', '破獲數：' + s2[idx].toLocaleString() + ' 件');
    };
    r2.onmouseleave = hideTip;
    svg.appendChild(r2);

    // 7-3. 繪製藍色長條頂端數值（放大至 13px）：
    // 設定 x = cx - 4 搭配 text-anchor="end"（靠右對齊），讓文字以中心線為基準「向左延伸」，徹底避免與右側橘條數字重疊
    const lbl1 = createSvgEl('text', {
      x: cx - 4, y: y1 - 7, fill: '#F8FAFC', 'font-size': '13', 'font-weight': '700', 'text-anchor': 'end'
    });
    lbl1.textContent = s1[idx].toLocaleString();
    svg.appendChild(lbl1);

    // 7-4. 繪製橘色長條頂端數值（放大至 13px）：
    // 設定 x = cx + 4 搭配 text-anchor="start"（靠左對齊），讓文字以中心線為基準「向右延伸」，確保兩組四位數互不干擾
    const lbl2 = createSvgEl('text', {
      x: cx + 4, y: y2 - 7, fill: '#FDBA74', 'font-size': '13', 'font-weight': '700', 'text-anchor': 'start'
    });
    lbl2.textContent = s2[idx].toLocaleString();
    svg.appendChild(lbl2);

    // 7-5. 繪製底部 X 軸年份標籤（放大至 14px，置中對齊於群組中心線 cx）
    const yrTxt = createSvgEl('text', {
      x: cx, y: H - 10, fill: '#CBD5E1', 'font-size': '14', 'font-weight': '600', 'text-anchor': 'middle'
    });
    yrTxt.textContent = yr;
    svg.appendChild(yrTxt);
  });

  // 8. 將組裝完成的整張 SVG 圖表正式掛載到網頁容器中顯示
  el.appendChild(svg);
}

//* ==================== 5. 其他圖表繪製函式（教室大螢幕放大版 + 詳細註解） ==================== */

/**
 * 5-1. 繪製單長條圖（用於呈現「故意殺人佔暴力犯罪比重 (%)」等單一指標歷年變化）
 * @param {string} containerId - 網頁上要放入圖表的 HTML 容器 ID
 * @param {Array<string>} labels - X 軸年份陣列（例如 ['2015', '2016', ...]）
 * @param {Array<number>} values - 各年度對應的數值陣列
 * @param {number} maxY - Y 軸的最大刻度上限（例如 40）
 * @param {string} color - 長條填充顏色（十六進位色碼）
 * @param {string} unit - 懸浮提示框顯示的單位（例如 '%'）
 */
function renderSingleBarChart(containerId, labels, values, maxY, color, unit) {
  // 1. 取得網頁圖表容器，若不存在則提前結束避免報錯
  const el = document.getElementById(containerId);
  if (!el) return;

  // 清空容器內原有內容（避免視窗縮放重繪時圖表重複疊加）
  el.textContent = '';

  // 2. 取得容器實際寬高，若尚未展開則套用預設值 520x320
  const W = el.clientWidth || 520;
  const H = el.clientHeight || 320;

  // 3. 設定圖表四周留白內距（Padding）：加寬左側與上方空間，容納放大後的 Y 軸與頂端數字
  const padL = 52, padR = 20, padT = 34, padB = 38;
  // 計算扣除內距後的有效繪圖寬度與高度
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // 計算每個年度群組所佔寬度，以及單根長條寬度（佔群組 56%，最大不超過 30px）
  const groupW = plotW / labels.length;
  const barW = Math.min(groupW * 0.56, 30);

  // 4. 建立外層 SVG 畫布並設定 viewBox 支援自適應縮放
  const svg = createSvgEl('svg', { width: '100%', height: '100%', viewBox: '0 0 ' + W + ' ' + H });

  // 5. 繪製水平背景參考虛線與左側 Y 軸刻度數字（切成 4 等份，共 5 條線）
  for (let i = 0; i <= 4; i++) {
    const val = (maxY / 4) * i;
    const y = padT + plotH - (plotH * i) / 4;

    // 繪製水平半透明灰色虛線
    svg.appendChild(createSvgEl('line', {
      x1: padL, y1: y, x2: W - padR, y2: y, stroke: 'rgba(255,255,255,0.1)', 'stroke-dasharray': '4,4'
    }));

    // 繪製左側 Y 軸刻度數字（放大至 13px，投影更清晰）
    const t = createSvgEl('text', {
      x: padL - 10, y: y + 5, fill: '#94A3B8', 'font-size': '13', 'text-anchor': 'end'
    });
    t.textContent = val;
    svg.appendChild(t);
  }

  // 6. 逐一走訪每個年度，繪製「單根長條」、「頂端數值標籤」與「底部年份」
  labels.forEach(function(yr, idx) {
    // 計算該年度的水平中心點 X 座標
    const cx = padL + groupW * idx + groupW / 2;
    // 依最大值比例換算長條像素高度與頂端起點 Y 座標
    const h = (values[idx] / maxY) * plotH;
    const y = padT + plotH - h;

    // 6-1. 建立長條矩形（圓角 rx=4）
    const r = createSvgEl('rect', {
      x: cx - barW / 2, y: y, width: barW, height: h, rx: '4', fill: color
    });
    // 綁定滑鼠移入／移動事件：顯示懸浮提示框（Tooltip）
    r.onmousemove = function(e) {
      showTip(e, yr + ' 年', '殺人佔暴力犯罪比重：' + values[idx].toFixed(2) + unit, '');
    };
    r.onmouseleave = hideTip;
    svg.appendChild(r);

    // 6-2. 繪製長條頂端數值（從原本 10px 放大為 13px，置中顯示小數點後兩位）
    const lbl = createSvgEl('text', {
      x: cx, y: y - 8, fill: '#F8FAFC', 'font-size': '13', 'font-weight': '700', 'text-anchor': 'middle'
    });
    lbl.textContent = values[idx].toFixed(2);
    svg.appendChild(lbl);

    // 6-3. 繪製底部 X 軸年份文字（從原本 11px 放大為 13px，加粗提升辨識度）
    const yrTxt = createSvgEl('text', {
      x: cx, y: H - 10, fill: '#CBD5E1', 'font-size': '13', 'font-weight': '600', 'text-anchor': 'middle'
    });
    yrTxt.textContent = yr;
    svg.appendChild(yrTxt);
  });

  // 7. 將完成的 SVG 圖表掛載至網頁容器中
  el.appendChild(svg);
}

/**
 * 5-2. 繪製上下堆疊長條圖（用於呈現「男女性別比例」或「上下兩層結構組成」的歷年變化）
 * @param {string} containerId - 網頁圖表容器 ID
 * @param {Array<string>} labels - X 軸年份陣列
 * @param {Array<number>} bottomVals - 下層長條數值陣列
 * @param {Array<number>} topVals - 上層長條數值陣列
 * @param {string} bottomColor - 下層長條顏色
 * @param {string} topColor - 上層長條顏色
 * @param {boolean} isPct - 是否為百分比數據（true 顯示小數點後一位與 %，false 顯示整數與人）
 * @param {number} maxY - Y 軸最大刻度上限（例如 100）
 */
function renderStackedBarChart(containerId, labels, bottomVals, topVals, bottomColor, topColor, isPct, maxY) {
  // 1. 取得網頁圖表容器，若不存在則提前結束
  const el = document.getElementById(containerId);
  if (!el) return;

  // 清空容器內原有內容
  el.textContent = '';

  // 2. 取得容器實際寬高，若尚未展開則套用預設值 420x300
  const W = el.clientWidth || 420;
  const H = el.clientHeight || 300;

  // 3. 設定圖表四周留白內距（加寬左側與底部空間，配合放大後的座標軸字級）
  const padL = 50, padR = 20, padT = 24, padB = 38;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // 計算每個群組寬度與單根堆疊長條寬度
  const groupW = plotW / labels.length;
  const barW = Math.min(groupW * 0.54, 44);

  // 4. 建立外層 SVG 畫布
  const svg = createSvgEl('svg', { width: '100%', height: '100%', viewBox: '0 0 ' + W + ' ' + H });

  // 5. 繪製背景水平參考虛線與左側 Y 軸刻度數字
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxY / 4) * i);
    const y = padT + plotH - (plotH * i) / 4;

    svg.appendChild(createSvgEl('line', {
      x1: padL, y1: y, x2: W - padR, y2: y, stroke: 'rgba(255,255,255,0.1)', 'stroke-dasharray': '4,4'
    }));

    // Y 軸刻度文字（放大至 13px）
    const t = createSvgEl('text', {
      x: padL - 10, y: y + 5, fill: '#94A3B8', 'font-size': '13', 'text-anchor': 'end'
    });
    t.textContent = val;
    svg.appendChild(t);
  }

  // 6. 逐一走訪每個年度，由下往上堆疊繪製「下層長條」與「上層長條」
  labels.forEach(function(yr, idx) {
    const cx = padL + groupW * idx + groupW / 2;
    const bVal = bottomVals[idx];
    const tVal = topVals[idx];

    // 換算下層高度（hBot）與上層高度（hTop），並推算各自的頂端 Y 座標
    const hBot = (bVal / maxY) * plotH;
    const hTop = (tVal / maxY) * plotH;
    const yBot = padT + plotH - hBot;
    const yTop = yBot - hTop; // 上層緊接在下層頂端上方
    const suffix = isPct ? '%' : ' 人';

    // 6-1. 繪製下層長條矩形
    const rBot = createSvgEl('rect', {
      x: cx - barW / 2, y: yBot, width: barW, height: hBot, fill: bottomColor
    });
    rBot.onmousemove = function(e) {
      showTip(e, yr + ' 年', '下層數值：' + bVal + suffix, '上層數值：' + tVal + suffix);
    };
    rBot.onmouseleave = hideTip;
    svg.appendChild(rBot);

    // 6-2. 繪製上層長條矩形（頂端加上圓角 rx=3）
    const rTop = createSvgEl('rect', {
      x: cx - barW / 2, y: yTop, width: barW, height: hTop, rx: '3', fill: topColor
    });
    rTop.onmousemove = function(e) {
      showTip(e, yr + ' 年', '下層數值：' + bVal + suffix, '上層數值：' + tVal + suffix);
    };
    rTop.onmouseleave = hideTip;
    svg.appendChild(rTop);

    // 6-3. 若下層區塊高度超過 20px，在區塊正中央顯示白色數值（放大至 13px）
    if (hBot > 20) {
      const tb = createSvgEl('text', {
        x: cx, y: yBot + hBot / 2 + 5, fill: '#fff', 'font-size': '13', 'font-weight': '700', 'text-anchor': 'middle'
      });
      tb.textContent = isPct ? bVal.toFixed(1) : bVal;
      svg.appendChild(tb);
    }

    // 6-4. 若上層區塊高度超過 18px，在區塊正中央顯示淺色數值（放大至 13px）
    if (hTop > 18) {
      const tt = createSvgEl('text', {
        x: cx, y: yTop + hTop / 2 + 5, fill: '#F8FAFC', 'font-size': '13', 'font-weight': '700', 'text-anchor': 'middle'
      });
      tt.textContent = isPct ? tVal.toFixed(1) : tVal;
      svg.appendChild(tt);
    }

    // 6-5. 繪製底部 X 軸年份文字（放大至 14px，加粗提升投影清晰度）
    const yrTxt = createSvgEl('text', {
      x: cx, y: H - 10, fill: '#CBD5E1', 'font-size': '14', 'font-weight': '600', 'text-anchor': 'middle'
    });
    yrTxt.textContent = yr;
    svg.appendChild(yrTxt);
  });

  // 7. 將組裝完成的 SVG 圖表掛載到網頁容器中
  el.appendChild(svg);
}

/* ==================== 趨勢圖：Google Trends 搜尋熱度（教室大螢幕放大版） ==================== */
function renderTrendsChart() {
  // 1. 取得網頁上負責放趨勢圖的容器元素，若找不到則直接結束函式避免報錯
  const el = document.getElementById('trendsChart');
  if (!el) return;

  // 清空容器內原有的圖表內容（避免視窗縮放重繪時重複疊加）
  el.textContent = '';

  // 2. 取得容器的實際寬度與高度，若尚未渲染出尺寸則給予預設值 500x260
  const W = el.clientWidth || 500;
  const H = el.clientHeight || 260;

  // 3. 設定圖表四周的內距（Padding）：加寬左右與上方留白，避免放大至 14px 的事件文字超出邊界被裁切
  const padL = 56, padR = 72, padT = 34, padB = 32;
  // 計算扣除四周內距後，實際用來繪製折線的「有效畫布寬度與高度」
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // 4. 定義歷年重大社會事件與對應的 Google Trends 搜尋熱度指數（0～100）
  // peak: true 代表該年度為搜尋熱度高峰事件，圖表上會顯示完整事件名稱
  const pts = [
    { label: '2014 北捷鄭捷案', val: 92, peak: true },
    { label: '2015', val: 11, peak: false },
    { label: '2016 內湖小燈泡案', val: 100, peak: true },
    { label: '2018', val: 16, peak: false },
    { label: '2020 新店案', val: 64, peak: true },
    { label: '2022', val: 10, peak: false },
    { label: '2024 中捷洪淨案', val: 72, peak: true },
    { label: '2025 北捷張文案', val: 88, peak: true }
  ];

  // 計算每個資料點在 X 軸（水平方向）上的平均間隔距離
  const stepX = plotW / (pts.length - 1);
  // 用來累積 SVG 折線路徑（<path> 的 d 屬性）的指令字串
  let pathD = '';

  // 5. 建立外層 SVG 畫布，並設定 viewBox 讓圖表具備自適應縮放能力
  const svg = createSvgEl('svg', { width: '100%', height: '100%', viewBox: '0 0 ' + W + ' ' + H });

  // 6. 繪製底部 X 軸基準線（半透明白色細線）
  svg.appendChild(createSvgEl('line', {
    x1: padL, y1: padT + plotH, x2: W - padR, y2: padT + plotH, stroke: 'rgba(255,255,255,0.2)'
  }));

  // 7. 先建立折線的 <path> 元素並加入畫布（確保折線位於資料圓點的下層，不會蓋住圓點）
  const pathEl = createSvgEl('path', { fill: 'none', stroke: '#E86F3A', 'stroke-width': '2.5' });
  svg.appendChild(pathEl);

  // 8. 逐一走訪每個年度資料點，計算座標並繪製「資料圓點」與「高峰事件標籤」
  pts.forEach(function(p, i) {
    // 計算該點在 SVG 上的 X 座標（左邊距 + 第 i 格的距離）
    const x = padL + stepX * i;
    // 計算該點在 SVG 上的 Y 座標（SVG 的 Y 軸由上往下遞增，因此數值越高越靠近上方）
    const y = padT + plotH - (p.val / 100) * plotH;

    // 串接折線路徑指令：第一個點使用 'M' (Move To 移動起點)，後續點使用 'L' (Line To 畫直線連接)
    pathD += (i === 0 ? 'M ' + x + ' ' + y : ' L ' + x + ' ' + y);

    // 判斷是否為搜尋熱度高峰（熱度大於等於 60 視為高峰事件）
    const isPeak = p.val >= 60;

    // 建立資料節點圓圈（高峰事件用較大的橘色圓點 r=6，一般年份用較小的藍色圓點 r=3.8）
    const c = createSvgEl('circle', {
      cx: x, cy: y, r: isPeak ? '6' : '3.8', fill: isPeak ? '#E86F3A' : '#60A5FA'
    });

    // 綁定滑鼠互動事件：滑鼠移入或移動時顯示懸浮提示框（Tooltip），移出時隱藏
    c.onmousemove = function(e) { showTip(e, p.label, '搜尋熱度指數：' + p.val, ''); };
    c.onmouseleave = hideTip;
    svg.appendChild(c);

    // 9. 若為高峰事件，在圓點上方加上事件名稱標籤
    if (isPeak) {
      // 判斷是否為最後一筆資料（避免文字向右超出畫布邊界）
      const isLast = (i === pts.length - 1);
      // 判斷是否為「中捷」事件（因右側緊鄰更高點的斜線，需將文字往左偏移避免壓到橘色折線）
      const isTaichung = p.label.indexOf('中捷') !== -1;

      const pt = createSvgEl('text', {
        // 針對最後一點與中捷事件微調 X 軸水平位置
        x: isLast ? x + 12 : (isTaichung ? x - 10 : x),
        // 微調 Y 軸垂直高度，讓文字與圓點保持適當間距
        y: isTaichung ? y - 6 : y - 12,
        fill: '#FDBA74',
        'font-size': '14', // 從原本的 10 放大為 14，確保教室大螢幕投影清晰可見
        'font-weight': '700',
        // 最後一點與中捷事件改為靠右對齊 ('end')，其餘事件置中對齊 ('middle')
        'text-anchor': (isLast || isTaichung) ? 'end' : 'middle'
      });
      pt.textContent = p.label;
      svg.appendChild(pt);
    }
  });

  // 10. 將組裝完成的完整折線路徑寫入 <path> 元素，並將整張 SVG 圖表掛載到網頁容器中
  pathEl.setAttribute('d', pathD);
  el.appendChild(svg);
}

function renderGenderSection() {
const d = genderData[activeGender];
document.getElementById('genderRelTitle').textContent = d.relTitle;
document.getElementById('genderLocTitle').textContent = d.locTitle;
document.getElementById('dotRelKnown').style.background = d.color;
const box = document.getElementById('genderInsight');
box.textContent = '';
const h3 = document.createElement('h3');
h3.textContent = d.heading;
box.appendChild(h3);
d.items.forEach(function(item) {
const div = document.createElement('div');
div.className = 'insight-item';
const st = document.createElement('strong');
st.textContent = item.title;
const sp = document.createElement('span');
sp.textContent = item.desc;
div.appendChild(st);
div.appendChild(sp);
box.appendChild(div);
});
renderStackedBarChart('genderRelChart', relYears, d.knownPct, d.strangerPct, d.color, '#64748B', true, 100);
renderStackedBarChart('genderLocChart', relYears, d.homePct, d.nonHomePct, '#F59E0B', '#64748B', true, 100);
}
function renderAllCharts() {
renderTrendsChart();
renderGroupedBarChart('violentChart', years10, violentOccur, violentClear, 2200, true);
renderGroupedBarChart('homicideChart', years10, homicideOccur, homicideClear, 500, true);
renderSingleBarChart('ratioChart', years10, homicideRatio, 40, '#EF4444', '%');
renderStackedBarChart('relationChart', relYears, relKnown, relStranger, '#EF4444', '#64748B', false, 260);
renderGenderSection();
}
window.addEventListener('resize', renderAllCharts);
window.addEventListener('load', function() { updateHUD(); renderAllCharts(); });