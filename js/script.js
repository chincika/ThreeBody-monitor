let CHRONICLE_EVENTS = {};

// 三体编年史事件数据（来源：三体灰机Wiki）

// 三体舰队运行监控系统 - 核心逻辑

// 纪元定义 (根据需求说明)
const ERAS = [
    { name: '公元纪年', start: -Infinity, end: 2007, type: 'normal' },
    // 魔法时代: 1453年5月3日16时 - 1453年5月28日21时
    { 
        name: '魔法时代', 
        start: new Date(1453, 4, 3, 16).getTime(), 
        end: new Date(1453, 4, 28, 21).getTime(), 
        type: 'precise' 
    },
    { name: '黄金时代', start: 1980, end: 2007, type: 'normal' },
    { name: '危机纪元', start: 2007, end: 2214, type: 'normal' },   // XML: 公元2007~2214，208年
    { name: '威慑纪元', start: 2214, end: 2275, type: 'normal' },   // XML: 公元2214~2275，62年
    { name: '威慑后', start: 2275, end: 2276, type: 'normal' },     // XML: 公元2275~2276，2年
    { name: '广播纪元', start: 2276, end: 2336, type: 'normal' },   // XML: 公元2276~2336，61年
    { name: '掩体纪元', start: 2337, end: 2403, type: 'normal' },   // XML: 公元2337~2403，67年
    { name: '银河纪元', start: 2281, end: 2689, type: 'normal' },   // XML: 公元2281~不明
    { name: 'DX3906黑域纪元', start: 2689, end: 18906418, type: 'normal' }, // XML: 公元2689~不明
    { name: '647号宇宙时间线', start: 18906418, end: Infinity, type: 'normal' }, // XML: 公元18906418~不明
];

// 航行常量
const LIGHT_SPEED_KM_S = 299792.458; // 光速 km/s
const TOTAL_DISTANCE_LY = 4.22; // 总距离（光年）
const LY_TO_KM = 9.4607e12; // 1光年 = ? km
const TOTAL_DISTANCE_KM = TOTAL_DISTANCE_LY * LY_TO_KM;
const JOURNEY_START_YEAR = 1982; // 舰队出发年份
const JOURNEY_START_DATE = new Date('1982-01-01T00:00:00');

// 阶段定义 (时间单位: 年)
// 注意: 速度单位 km/s
const PHASES = [
    { 
        name: '加速阶段', 
        duration: 7 / 365.25, // 7天
        startSpeed: 0,
        endSpeed: 12.8 
    },
    { 
        name: '加速阶段', 
        duration: 174.8275, // 缩短后约 174.83年
        startSpeed: 12.8,
        endSpeed: LIGHT_SPEED_KM_S * 0.1 
    },
    { 
        name: '滑行阶段', 
        duration: 50, 
        startSpeed: LIGHT_SPEED_KM_S * 0.1,
        endSpeed: LIGHT_SPEED_KM_S * 0.1 
    },
    { 
        name: '减速阶段', 
        duration: 174.8275, // 缩短后约 174.83年
        startSpeed: LIGHT_SPEED_KM_S * 0.1,
        endSpeed: 0 
    }
];

// 预计算阶段结束时间和距离 (理论值)
let accumulatedTime = 0;
let accumulatedDistance = 0;
const PHASE_META = PHASES.map(phase => {
    const startTime = accumulatedTime;
    const endTime = accumulatedTime + phase.duration;
    
    // 距离积分: d = v0*t + 0.5*a*t^2
    // v(t) = v0 + a*t
    // a = (v1 - v0) / duration
    // convert duration to seconds for physics
    const durationSec = phase.duration * 365.25 * 24 * 3600;
    const accel = (phase.endSpeed - phase.startSpeed) / durationSec; // km/s^2
    
    const distanceKm = phase.startSpeed * durationSec + 0.5 * accel * durationSec * durationSec;
    const distanceLy = distanceKm / LY_TO_KM;

    accumulatedTime = endTime;
    accumulatedDistance += distanceLy;

    return {
        ...phase,
        startTime,
        endTime,
        distanceLy,
        accel
    };
});

// 计算缩放因子: 4.22 / 理论总距离
// 理论总距离大约是 25光年 (如果按0.1c跑200年)
// 为了匹配用户给定的 4.22光年，我们需要缩放距离
const SCALE_FACTOR = TOTAL_DISTANCE_LY / accumulatedDistance;

// 模拟时间逻辑
let IS_SIMULATING = false;
let SIMULATED_YEAR = new Date().getFullYear();
let SIMULATED_TIME_OFFSET = 0; // 毫秒偏移

let CURRENT_SPEED_PERCENT = 0;


function init() {
    updateDashboard();
    setInterval(updateDashboard, 100); // High refresh rate for smooth numbers
    createStars();
    initWarpController();
    initSearchBar();
    initBackgroundRotation();
    syncLeftPanelHeight();
    // 窗口resize时重新对齐
    window.addEventListener('resize', syncLeftPanelHeight);
}

// 让左侧面板高度始终与中间面板保持一致
function syncLeftPanelHeight() {
    const centerPanel = document.querySelector('.center-panel');
    const leftPanel   = document.querySelector('.left-panel');
    if (!centerPanel || !leftPanel) return;
    const h = centerPanel.getBoundingClientRect().height;
    if (h > 0) leftPanel.style.height = h + 'px';
}

// 背景轮询切换逻辑
function initBackgroundRotation() {
    const bgImages = [
        'assets/images/bg.jpg',
        'assets/images/bg1.jpg',
        'assets/images/0.jpg'
    ];
    
    let currentBgIndex = 0;
    const starfield = document.getElementById('starfield');
    
    if (!starfield) return;

    // 每 3 分钟切换一次 (180000 毫秒)
    setInterval(() => {
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        const nextBg = bgImages[currentBgIndex];
        
        // 预加载图片以确保切换平滑
        const img = new Image();
        img.src = nextBg;
        img.onload = () => {
            // 切换背景，保持原有的 linear-gradient 遮罩
            starfield.style.backgroundImage = `linear-gradient(rgba(10, 14, 23, 0.7), rgba(10, 14, 23, 0.7)), url('${nextBg}')`;
        };
    }, 180000); 
}

let LAST_DISPLAYED_YEAR = null;

function updateDashboard() {
    let now = new Date();
    
    // 如果处于模拟模式，应用偏移量
    if (IS_SIMULATING) {
        now = new Date(now.getTime() + SIMULATED_TIME_OFFSET);
    }
    
    // 1. 更新纪元
    updateEra(now);

    // 2. 更新航行数据
    updateFleetStatus(now);

    // 3. 动态标题 & 页脚
    const _titleYear = IS_SIMULATING
        ? (new Date(new Date().getTime() + SIMULATED_TIME_OFFSET)).getFullYear()
        : now.getFullYear();
    updateTitle(_titleYear);
    updateFooter(_titleYear);

    // 更新标题栏当前日期（随时空穿梭年份变化）
    const headerDateEl = document.getElementById('headerCurrentDate');
    if (headerDateEl) {
        const displayYear = IS_SIMULATING
            ? (new Date(new Date().getTime() + SIMULATED_TIME_OFFSET)).getFullYear()
            : now.getFullYear();
        const displayMonth = IS_SIMULATING
            ? (new Date(new Date().getTime() + SIMULATED_TIME_OFFSET)).getMonth() + 1
            : now.getMonth() + 1;
        const displayDay = IS_SIMULATING
            ? (new Date(new Date().getTime() + SIMULATED_TIME_OFFSET)).getDate()
            : now.getDate();
        headerDateEl.textContent = IS_SIMULATING
            ? `公元 ${displayYear} 年`
            : `公元 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
    }

    // 4. 非穿梭模式下，跟随真实年份显示事件（年份变化时才刷新）
    if (!IS_SIMULATING) {
        const currentYear = now.getFullYear();
        if (currentYear !== LAST_DISPLAYED_YEAR) {
            LAST_DISPLAYED_YEAR = currentYear;
            showChronicleEvents(currentYear);
        }
    }
}

// 初始化时空穿梭控制器
function initWarpController() {
    const panel = document.getElementById('warpController');
    const warpModeBtn = document.getElementById('warpModeBtn');
    const slider = document.getElementById('warpSlider');
    const yearInput = document.getElementById('warpYearInput');
    const resetBtn = document.getElementById('resetTime');
    const warpDisplay = document.getElementById('warpYearDisplay');
    const markersContainer = document.getElementById('eraMarkers');
    
    if (!panel || !slider || !resetBtn || !warpModeBtn) return;

    const totalDuration = PHASE_META[PHASE_META.length-1].endTime;
    const arrivalYear = Math.ceil(JOURNEY_START_YEAR + totalDuration);
    
    const minYear = JOURNEY_START_YEAR;
    const maxYear = arrivalYear;
    slider.min = minYear;
    slider.max = maxYear;
    yearInput.min = minYear;
    yearInput.max = maxYear;

    const updateWarp = (year) => {
        const selectedYear = Math.max(minYear, Math.min(maxYear, parseInt(year)));
        const currentRealDate = new Date();
        const targetDate = new Date(currentRealDate);
        targetDate.setFullYear(selectedYear);
        
        SIMULATED_TIME_OFFSET = targetDate.getTime() - currentRealDate.getTime();
        IS_SIMULATING = true;
        
        warpDisplay.textContent = selectedYear + ' 年';
        slider.value = selectedYear;
        yearInput.value = selectedYear;
        document.body.classList.add('time-warping');
        resetBtn.style.opacity = '1';
        resetBtn.style.pointerEvents = 'auto';
        showChronicleEvents(selectedYear);
    };

    // 暴露给标记点击事件
    window.updateWarpFunction = updateWarp;

    // 滚轮微调：鼠标悬停在 warp 面板时，滚轮每格 ±1 年（按住 Shift 则 ±10 年）
    panel.addEventListener('wheel', (e) => {
        if (!panel.classList.contains('active')) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const direction = e.deltaY > 0 ? 1 : -1; // 向下滚 = 年份增加
        const currentYear = parseInt(slider.value) || minYear;
        updateWarp(currentYear + direction * step);
    }, { passive: false });

    // 1. 点击专门的 WARP MODE 按钮切换显示
    warpModeBtn.addEventListener('click', () => {
        const isActive = panel.classList.toggle('active');
        warpModeBtn.classList.toggle('active', isActive);
        // 激活时默认设置为当前年份
        if (isActive && !IS_SIMULATING) {
            const currentYear = new Date().getFullYear();
            slider.value = currentYear;
            yearInput.value = currentYear;
            warpDisplay.textContent = 'REAL-TIME';
        }
    });

    renderEraMarkers(markersContainer, minYear, maxYear);

    slider.addEventListener('input', (e) => updateWarp(e.target.value));
    yearInput.addEventListener('change', (e) => updateWarp(e.target.value));

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发面板切换
        IS_SIMULATING = false;
        SIMULATED_TIME_OFFSET = 0;
        LAST_DISPLAYED_YEAR = null; // 强制下一帧刷新当前年份事件
        const currentYear = new Date().getFullYear();
        slider.value = currentYear;
        yearInput.value = currentYear;
        warpDisplay.textContent = 'REAL-TIME';
        document.body.classList.remove('time-warping');
        resetBtn.style.opacity = '0';
        resetBtn.style.pointerEvents = 'none';
    });
}

function renderEraMarkers(container, minYear, maxYear) {
    if (!container) return;
    container.innerHTML = '';
    
    // 过滤出在航行期间切换的纪元
    const relevantEras = ERAS.filter(era => 
        era.type === 'normal' && era.start > minYear && era.start < maxYear
    );

    let lastPos = -20; // 记录上一个标记的位置百分比
    let staggerLevel = 0; // 0: 正常, 1: staggered, 2: staggered-deep

    relevantEras.forEach((era, index) => {
        const percent = ((era.start - minYear) / (maxYear - minYear)) * 100;
        const marker = document.createElement('div');
        
        // 判定是否重叠（小于 8% 视为拥挤）
        if (percent - lastPos < 8) {
            staggerLevel = (staggerLevel + 1) % 3; // 循环 0, 1, 2
        } else {
            staggerLevel = 0; // 空间足够，回归正常层级
        }

        let className = 'era-marker';
        if (staggerLevel === 1) className += ' staggered';
        if (staggerLevel === 2) className += ' staggered-deep';

        marker.className = className;
        marker.style.left = `${percent}%`;
        marker.title = `点击跳转到 ${era.name} 元年 (${era.start}年)`;
        
        marker.innerHTML = `
            <div class="marker-dot"></div>
            <div class="era-marker-label">${era.name}</div>
        `;

        // 添加点击跳转功能
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            const updateWarp = window.updateWarpFunction; 
            if (updateWarp) updateWarp(era.start);
        });

        container.appendChild(marker);
        lastPos = percent;
    });
}

function updateEra(date) {
    const year = date.getFullYear();
    const timestamp = date.getTime();
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;
    const dateStr = `${month}月${day}日`;

    // 查找所有匹配的纪元
    let activeEras = [];
    for (let i = 0; i < ERAS.length; i++) {
        const era = ERAS[i];
        if (era.type === 'precise') {
            if (timestamp >= era.start && timestamp <= era.end) {
                activeEras.push(era);
            }
        } else {
            if (year >= era.start && (era.end === undefined || year < era.end || era.end === Infinity)) {
                activeEras.push(era);
            }
        }
    }

    if (activeEras.length === 0) activeEras = [ERAS[0]];

    // 格式化纪元名称: A / B
    const eraNames = activeEras.map(e => e.name).join(' / ');
    document.getElementById('eraName').textContent = eraNames;
    
    // 格式化纪元年份: 支持多纪元叠加，同时附上公元年份
    const eraYearParts = activeEras.map(era => {
        let eraYear;
        if (era.type === 'precise') {
            eraYear = '元年';
        } else if (era.start === -Infinity) {
            eraYear = year > 0 ? `${year}年` : `前${Math.abs(year)}年`;
        } else {
            const y = year - era.start + 1;
            eraYear = y === 1 ? '元年' : y + '年';
        }
        return `${era.name}${eraYear}`;
    });

    // 附上公元年份
    const eraYearsHtml = eraYearParts.join('<br>') + `<br><span style="font-size:0.85em;opacity:0.65;letter-spacing:1px;">公元 ${year} 年</span>`;
    
    document.getElementById('eraYearNum').innerHTML = eraYearsHtml;
    document.getElementById('eraDateTime').textContent = `${dateStr} ${timeStr}`;
    document.getElementById('commonYear').textContent = `(参考: 公元 ${year}年${month}月${day}日 ${timeStr})`;
    document.getElementById('commonTime').style.display = 'none';
}

function updateFleetStatus(now) {
    // 计算航行时间 (年)
    const msPerYear = 365.25 * 24 * 3600 * 1000;
    const elapsedMs = now - JOURNEY_START_DATE;
    const elapsedYears = elapsedMs / msPerYear;

    if (elapsedYears < 0) {
        // 还没出发
        updateDisplay(0, 0, 0, '未出发', 0);
        return;
    }

    // 确定当前阶段
    let currentPhase = PHASE_META[PHASE_META.length - 1];
    let phaseIndex = PHASE_META.length - 1;
    let isFinished = false;

    if (elapsedYears >= PHASE_META[PHASE_META.length - 1].endTime) {
        isFinished = true;
    } else {
        for (let i = 0; i < PHASE_META.length; i++) {
            if (elapsedYears < PHASE_META[i].endTime) {
                currentPhase = PHASE_META[i];
                phaseIndex = i;
                break;
            }
        }
    }

    // 计算当前速度和距离
    // 如果已经到达，直接设为结束状态
    if (isFinished) {
        updateDisplay(0, 0, elapsedYears * 0.08, '已到达太阳系', elapsedYears);
        return;
    }

    const timeInPhase = elapsedYears - currentPhase.startTime; // years
    const timeInPhaseSec = timeInPhase * 365.25 * 24 * 3600;
    
    // v = v0 + at
    let currentSpeed = currentPhase.startSpeed + currentPhase.accel * timeInPhaseSec;
    // Clamp speed if beyond phase end (shouldn't happen with logic above unless last phase)
    if (elapsedYears > PHASE_META[PHASE_META.length-1].endTime) {
        currentSpeed = 0;
    }

    // 计算当前累计距离 (理论值)
    let dist = 0; // light years
    for (let i = 0; i < phaseIndex; i++) {
        dist += PHASE_META[i].distanceLy;
    }
    // Add distance in current phase
    // d = v0*t + 0.5*a*t^2
    const distInPhaseKm = currentPhase.startSpeed * timeInPhaseSec + 0.5 * currentPhase.accel * timeInPhaseSec * timeInPhaseSec;
    dist += distInPhaseKm / LY_TO_KM;

    // 应用缩放因子
    const displayDistLy = dist * SCALE_FACTOR;
    
    // 剩余距离
    let remainingLy = TOTAL_DISTANCE_LY - displayDistLy;
    if (remainingLy < 0) remainingLy = 0;

    // 损耗率: 0.08% * 航行年数
    // 增加小数位以显示微小变化，即便每分钟变化微小，但在高精度下可见
    const attrition = elapsedYears * 0.08;

    updateDisplay(currentSpeed, remainingLy, attrition, currentPhase.name, elapsedYears);
}

function updateDisplay(speed, remainingLy, attrition, phaseName, elapsedYears) {
    // 速度
    // Add micro-fluctuation to make it look "alive" (sensor noise)
    const noise = (Math.random() - 0.5) * 0.00001; 
    const displaySpeed = speed > 0 ? speed + noise : speed;
    
    document.getElementById('speedValue').textContent = displaySpeed.toFixed(6) + ' km/s';
    // 光速比例显示（使用真实速度避免噪点抖动）
    const cFrac = speed > 0 ? (speed / LIGHT_SPEED_KM_S) : 0;
    document.getElementById('speedC').textContent = cFrac.toFixed(3) + 'c';
    document.getElementById('speedPhase').textContent = phaseName;
    
    // 进度条 (基于最大速度 0.1c = ~30000)
    const maxSpeed = LIGHT_SPEED_KM_S * 0.1;
    const speedPercent = Math.min(100, (speed / maxSpeed) * 100);
    document.getElementById('speedProgress').style.width = speedPercent + '%';
    CURRENT_SPEED_PERCENT = speedPercent;

    // 距离
    if (remainingLy <= 0) {
        document.getElementById('distanceValue').textContent = '已到达太阳系';
        document.getElementById('distanceKm').textContent = '0.00 km';
    } else {
        document.getElementById('distanceValue').textContent = '距太阳系 ' + remainingLy.toFixed(4) + ' 光年';
        const remainingKm = remainingLy * LY_TO_KM;
        document.getElementById('distanceKm').textContent = remainingKm.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' km';
    }
    
    // 距离进度 (总距离 - 剩余) / 总距离
    const distPercent = Math.min(100, ((TOTAL_DISTANCE_LY - remainingLy) / TOTAL_DISTANCE_LY) * 100);
    document.getElementById('distanceProgress').style.width = distPercent + '%';

    // 损耗 - 恢复正常精度 (例如2位小数)，但底层计算仍然是实时的
    document.getElementById('attritionValue').textContent = attrition.toFixed(2) + '%';
    document.getElementById('attritionDetail').textContent = `${elapsedYears.toFixed(2)} 年`;

    // 预计到达
    const totalDuration = PHASE_META[PHASE_META.length-1].endTime;
    const remainingYears = totalDuration - elapsedYears;
    const arrivalYear = JOURNEY_START_YEAR + totalDuration;
    
    if (remainingYears > 0) {
        // 显示具体的预计到达日期
        const arrivalDate = new Date(JOURNEY_START_DATE.getTime() + totalDuration * 365.25 * 24 * 3600 * 1000);
        const arrivalYearStr = arrivalDate.getFullYear();
        const arrivalMonth = arrivalDate.getMonth() + 1;
        const arrivalDay = arrivalDate.getDate();
        
        document.getElementById('arrivalValue').textContent = `公元 ${arrivalYearStr}年${arrivalMonth}月${arrivalDay}日`;
        // 恢复剩余航程的正常显示精度
        document.getElementById('arrivalDetail').textContent = `剩余航程：${remainingYears.toFixed(2)} 年`;
        const arrivalPercent = (elapsedYears / totalDuration) * 100;
        document.getElementById('arrivalProgress').style.width = arrivalPercent + '%';
    } else {
        document.getElementById('arrivalValue').textContent = '已到达';
        document.getElementById('arrivalDetail').textContent = '航程结束';
        document.getElementById('arrivalProgress').style.width = '100%';
    }
}


function showChronicleEvents(year) {
    const list = document.getElementById('eventsList');
    const badge = document.getElementById('eventsYearBadge');
    if (!list) return;

    const events = CHRONICLE_EVENTS[String(year)];

    if (badge) badge.textContent = `公元 ${year} 年`;

    if (!events || events.length === 0) {
        list.innerHTML = '<div class="events-empty">◈ 本年度暂无记录事件</div>';
        return;
    }

    list.innerHTML = events.map((e, i) => `
        <div class="event-item" style="animation-delay: ${i * 0.06}s">
            <span class="event-dot">▶</span>
            <span class="event-text">${e}</span>
        </div>
    `).join('');
    // 每次更新后滚回顶部
    list.scrollTop = 0;
}

function clearChronicleEvents() {
    const list = document.getElementById('eventsList');
    const badge = document.getElementById('eventsYearBadge');
    if (badge) badge.textContent = '--';
    if (list) list.innerHTML = '<div class="events-empty">◈ 开启时空穿梭后，拖动时间轴查看该年发生的事件</div>';
}


// ===== 动态标题配置 =====
// ── 年份速查 ──────────────────────────────────────────────────────────
// 危机纪元  : 2007(元年) 2135(129年) 2136(130年) 2205(199年) 2211(205年) 2214(208年/末)
// 威慑纪元  : 2214(元年) 2215(2年)  2275(62年/末)
// 广播纪元  : 2276(元年) 2283(8年)  2336(末)
// 掩体纪元  : 2337(元年) 2338(2年)  2403(67年/末)

// 标题配置：en=英文大标题，zh=中文副标题（含望远镜注释）
const TITLE_CONFIG = [
    {
        minYear: -Infinity, maxYear: 2006,
        en: 'NASA EARLY WARNING CENTER',
        zh: '美国航空航天局预警中心（哈勃系列太空望远镜）',
    },
    {
        minYear: 2007, maxYear: 2135,
        en: 'UN PLANETARY DEFENSE COUNCIL · WARNING SYSTEM',
        zh: '联合国行星防御理事会太空预警系统（哈勃系列太空望远镜）',
    },
    {
        minYear: 2136, maxYear: 2210,
        en: 'SOLAR SYSTEM FLEET · SPACE WARNING SYSTEM',
        zh: '太阳系舰队太空预警系统（哈勃系列太空望远镜）',
    },
    {
        minYear: 2211, maxYear: 2337,
        en: 'SOLAR SYSTEM FLEET · SPACE WARNING SYSTEM',
        zh: '太阳系舰队太空预警系统（林格-斐兹罗太空望远镜）',
    },
    {
        minYear: 2338, maxYear: 2403,
        en: 'SOLAR WARNING SYSTEM · CONTROL CENTER',
        zh: '太阳系预警系统控制中心',
    },
];

// 页脚配置：org=机构, source=数据来源
const FOOTER_CONFIG = [
    {
        minYear: -Infinity, maxYear: 2006,
        org:       '三体舰队跟踪计划 · 美国航空航天局',
        source:    '数据来源: 尘埃云航迹推断 & ETO 资料',
        statusBar: 'FLEET TRACKING PROGRAM | NASA',
    },
    {
        minYear: 2007, maxYear: 2135,
        org:       '三体舰队跟踪计划 · 行星防御理事会',
        source:    '数据来源: 尘埃云航迹推断 & ETO 资料',
        statusBar: 'FLEET TRACKING PROGRAM | UN PLANETARY DEFENSE COUNCIL',
    },
    {
        minYear: 2136, maxYear: 2214,
        org:       '三体舰队跟踪计划 · 太阳系舰队总参谋部',
        source:    '数据来源: 尘埃云航迹推断 & ETO 资料',
        statusBar: 'FLEET TRACKING PROGRAM | SOLAR FLEET GENERAL STAFF',
    },
    {
        minYear: 2215, maxYear: 2275,
        org:       '强互作用力宇宙探测器预警计划 · 太阳系舰队总参谋部',
        source:    '数据来源: 太空望远镜监测',
        statusBar: 'WATERDROP WARNING PROGRAM | SOLAR FLEET GENERAL STAFF',
    },
    {
        minYear: 2276, maxYear: 2283,
        org:       '黑暗森林打击预警计划 · 太阳系预警系统',
        source:    '数据来源: 太空望远镜监测',
        statusBar: 'DARK FOREST STRIKE WARNING | SOLAR WARNING SYSTEM',
    },
    {
        minYear: 2284, maxYear: 2403,
        org:       '黑暗森林打击预警计划 · 太阳系预警系统',
        source:    '数据来源: 太空望远镜监测 & 曲率航迹观测',
        statusBar: 'DARK FOREST STRIKE WARNING | SOLAR WARNING SYSTEM',
    },
];

let LAST_TITLE_YEAR = null;

function updateTitle(year) {
    if (year === LAST_TITLE_YEAR) return;
    LAST_TITLE_YEAR = year;

    const titleEl    = document.getElementById('mainTitle');
    const subtitleEl = document.getElementById('mainSubtitle');
    if (!titleEl || !subtitleEl) return;

    const cfg   = TITLE_CONFIG.find(c => year >= c.minYear && year <= c.maxYear);
    const newEn = cfg ? cfg.en : 'THREE BODY FLEET MONITOR';
    const newZh = cfg ? cfg.zh : '三体舰队运行监控';

    if (titleEl.textContent === newEn && subtitleEl.textContent === newZh) return;

    titleEl.classList.remove('title-transition');
    subtitleEl.classList.remove('title-transition');
    void titleEl.offsetWidth; // 强制回流，重播动画

    titleEl.classList.add('title-transition');
    subtitleEl.classList.add('title-transition');
    titleEl.textContent    = newEn;
    subtitleEl.textContent = newZh;
}

function updateFooter(year) {
    const orgEl       = document.getElementById('footerOrg');
    const sourceEl    = document.getElementById('footerSource');
    const statusBarEl = document.getElementById('footerStatusBar');
    if (!orgEl || !sourceEl) return;

    const cfg = FOOTER_CONFIG.find(c => year >= c.minYear && year <= c.maxYear);
    if (!cfg) return;

    if (orgEl.textContent       !== cfg.org)       orgEl.textContent       = cfg.org;
    if (sourceEl.textContent    !== cfg.source)    sourceEl.textContent    = cfg.source;
    if (statusBarEl && statusBarEl.textContent !== cfg.statusBar)
        statusBarEl.textContent = cfg.statusBar;
}

function createStars() {}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/events.json')
        .then(r => r.json())
        .then(data => {
            CHRONICLE_EVENTS = data;
        })
        .catch(() => {
            console.warn('events.json 加载失败，事件数据为空');
        })
        .finally(() => {
            init();
        });
});

 

// ============================================================
// 系统信息检索 — 三体Wiki 查询
// ============================================================

function initSearchBar() {
    const input  = document.getElementById('searchInput');
    const btn    = document.getElementById('searchBtn');
    const overlay = document.getElementById('wikiModalOverlay');
    const closeBtn = document.getElementById('wikiModalClose');

    if (!input || !btn || !overlay) return;

    const doSearch = () => {
        const query = input.value.trim();
        if (!query) return;
        openWikiModal(query);
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
    });

    btn.addEventListener('click', doSearch);

    // Close modal
    closeBtn && closeBtn.addEventListener('click', closeWikiModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeWikiModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeWikiModal();
    });
}

function openWikiModal(query) {
    const overlay    = document.getElementById('wikiModalOverlay');
    const titleEl    = document.getElementById('wikiModalTitle');
    const linkEl     = document.getElementById('wikiModalLink');
    const loading    = document.getElementById('wikiLoading');
    const contentEl  = document.getElementById('wikiContent');
    const errorEl    = document.getElementById('wikiError');

    // Reset state
    titleEl.textContent = `检索中: ${query}`;
    linkEl.href = `https://santi.huijiwiki.com/wiki/${encodeURIComponent(query)}`;
    loading.style.display = 'flex';
    contentEl.style.display = 'none';
    errorEl.style.display = 'none';
    contentEl.innerHTML = '';
    errorEl.innerHTML = '';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    fetchWikiPage(query, titleEl, linkEl, loading, contentEl, errorEl);
}

function closeWikiModal() {
    const overlay = document.getElementById('wikiModalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// 构建带CORS代理的请求URL（多个备用代理依次尝试）
async function fetchWithCORSFallback(url) {
    // 先尝试直连（部分wiki可能已配置CORS）
    const proxies = [
        (u) => u,  // 直连
        (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
        (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    ];

    for (let i = 0; i < proxies.length; i++) {
        try {
            const proxyUrl = proxies[i](url);
            const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
            if (!res.ok) continue;

            // allorigins 返回包裹格式 { contents: "..." }
            if (proxyUrl.includes('allorigins')) {
                const wrapper = await res.json();
                const text = wrapper.contents;
                return JSON.parse(text);
            }
            return await res.json();
        } catch (e) {
            if (i === proxies.length - 1) throw e;
            // 继续尝试下一个代理
        }
    }
}

async function fetchWikiPage(query, titleEl, linkEl, loading, contentEl, errorEl) {
    // 使用MediaWiki API获取页面内容（HTML格式），多代理自动切换
    const apiBase = 'https://santi.huijiwiki.com/api.php';
    const params = new URLSearchParams({
        action: 'parse',
        page: query,
        format: 'json',
        prop: 'text|displaytitle',
        disableeditsection: '1',
        origin: '*'
    });

    try {
        const data = await fetchWithCORSFallback(`${apiBase}?${params}`);

        if (data.error) {
            // 页面不存在，尝试搜索
            if (data.error.code === 'missingtitle') {
                await searchWikiSuggestions(query, titleEl, loading, contentEl, errorEl);
                return;
            }
            throw new Error(data.error.info || '未知错误');
        }

        const html = data.parse.text['*'];
        const displayTitle = data.parse.displaytitle || query;

        titleEl.textContent = `◉ ${displayTitle}`;

        // 处理HTML内容：修正内部链接指向真实wiki
        const processed = processWikiHtml(html);

        loading.style.display = 'none';
        contentEl.style.display = 'block';
        contentEl.innerHTML = processed;

        // 让wiki内部链接点击时在弹窗内搜索
        contentEl.querySelectorAll('a[data-wiki-link]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = a.getAttribute('data-wiki-link');
                if (target) {
                    document.getElementById('searchInput').value = target;
                    openWikiModal(target);
                }
            });
        });

    } catch (err) {
        loading.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.innerHTML = `
            <div style="font-size:22px;margin-bottom:16px;opacity:0.5;">◈</div>
            <div style="color:var(--primary-color);margin-bottom:8px;letter-spacing:2px;">检索失败</div>
            <div style="opacity:0.6;font-size:11px;">${err.message}</div>
            <div style="margin-top:20px;">
                <a href="https://santi.huijiwiki.com/wiki/${encodeURIComponent(query)}" 
                   target="_blank" rel="noopener"
                   style="color:var(--secondary-color);font-size:11px;border:1px solid rgba(0,255,153,0.3);padding:6px 14px;border-radius:4px;text-decoration:none;">
                    在浏览器中直接打开 ↗
                </a>
            </div>
        `;
    }
}

async function searchWikiSuggestions(query, titleEl, loading, contentEl, errorEl) {
    // 页面不存在时，尝试搜索相关词条
    const apiBase = 'https://santi.huijiwiki.com/api.php';
    const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        srlimit: '8',
        origin: '*'
    });

    try {
        const data = await fetchWithCORSFallback(`${apiBase}?${params}`);
        const results = data?.query?.search || [];

        titleEl.textContent = `搜索结果: "${query}"`;
        loading.style.display = 'none';

        if (results.length === 0) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = `
                <div style="font-size:22px;margin-bottom:16px;opacity:0.5;">◈</div>
                <div style="color:var(--primary-color);margin-bottom:8px;letter-spacing:2px;">未找到相关词条</div>
                <div style="opacity:0.6;font-size:11px;">请尝试其他关键词</div>
            `;
            return;
        }

        contentEl.style.display = 'block';
        contentEl.innerHTML = `
            <div style="margin-bottom:16px;font-family:var(--font-display);font-size:11px;color:var(--text-muted);letter-spacing:1px;">
                ◈ 未找到精确词条，以下是相关结果：
            </div>
            ${results.map(r => `
                <div style="border:1px solid var(--border-color);border-radius:6px;padding:12px 16px;margin:8px 0;cursor:pointer;transition:all 0.2s;"
                     onmouseover="this.style.borderColor='rgba(0,212,255,0.4)';this.style.background='rgba(0,212,255,0.05)'"
                     onmouseout="this.style.borderColor='var(--border-color)';this.style.background=''"
                     onclick="document.getElementById('searchInput').value='${r.title.replace(/'/g,"\\'")}';openWikiModal('${r.title.replace(/'/g,"\\'")}')">
                    <div style="color:var(--primary-color);font-size:13px;margin-bottom:4px;">${r.title}</div>
                    <div style="font-size:11px;color:var(--text-muted);line-height:1.5;">${r.snippet.replace(/<[^>]+>/g,'').substring(0,120)}...</div>
                </div>
            `).join('')}
        `;
    } catch {
        loading.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.innerHTML = `<div style="opacity:0.5;">检索服务暂时不可用</div>`;
    }
}

function proxyImageUrl(src) {
    // 补全协议和域名
    if (src.startsWith('//')) src = 'https:' + src;
    else if (src.startsWith('/')) src = 'https://santi.huijiwiki.com' + src;
    // 通过 corsproxy.io 代理图片，绕过防盗链和CORS限制
    return 'https://corsproxy.io/?' + encodeURIComponent(src);
}

function processWikiHtml(html) {
    // 创建临时DOM处理链接
    const div = document.createElement('div');
    div.innerHTML = html;

    // 直接隐藏所有图片（wiki图片因防盗链无法跨域加载）
    div.querySelectorAll('img').forEach(img => {
        img.style.display = 'none';
    });
    // 同时隐藏只含图片的figure/图片容器，避免留下空白占位
    div.querySelectorAll('figure, .thumb, .thumbinner, .floatright, .floatleft, .image').forEach(el => {
        if (!el.textContent.trim()) el.style.display = 'none';
    });

    // 修正内部wiki链接为弹窗内跳转
    div.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('/wiki/')) {
            const pageName = decodeURIComponent(href.replace('/wiki/', '').split('#')[0]);
            a.setAttribute('data-wiki-link', pageName);
            a.setAttribute('href', '#');
            a.title = `检索: ${pageName}`;
        } else if (!href.startsWith('http')) {
            // 相对链接 -> 绝对链接
            a.href = 'https://santi.huijiwiki.com' + href;
            a.target = '_blank';
            a.rel = 'noopener';
        }
    });

    return div.innerHTML;
}

// 暴露给 onclick 内联使用
window.openWikiModal = openWikiModal;
