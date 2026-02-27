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
    { name: '危机纪元', start: 2007, end: 2208, type: 'normal' },
    { name: '威慑纪元', start: 2208, end: 2270, type: 'normal' },
    { name: '威慑后', start: 2270, end: 2272, type: 'normal' },
    { name: '广播纪元', start: 2272, end: 2332, type: 'normal' },
    { name: '掩体纪元', start: 2333, end: 2400, type: 'normal' },
    { name: '银河纪元', start: 2273, end: 2687, type: 'normal' }, // 2273-不明, assumed until Blue Star
    { name: '蓝星纪元', start: 2687, end: 2731, type: 'normal' },
    { name: '647号宇宙预备时间线', start: 2687, end: 18906416, type: 'normal' },
    { name: '647号宇宙时间线', start: 18906416, end: 11245632142, type: 'normal' },
    { name: '末世纪元', start: 11245632142, end: 11245632207, type: 'normal' },
    { name: '新宇宙时间线', start: 11245632207, end: Infinity, type: 'normal' }
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
}

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
    };

    // 暴露给标记点击事件
    window.updateWarpFunction = updateWarp;

    // 1. 点击专门的 WARP MODE 按钮切换显示
    warpModeBtn.addEventListener('click', () => {
        const isActive = panel.classList.toggle('active');
        warpModeBtn.classList.toggle('active', isActive);
    });

    renderEraMarkers(markersContainer, minYear, maxYear);

    slider.addEventListener('input', (e) => updateWarp(e.target.value));
    yearInput.addEventListener('change', (e) => updateWarp(e.target.value));

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发面板切换
        IS_SIMULATING = false;
        SIMULATED_TIME_OFFSET = 0;
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
    
    // 格式化纪元年份: 纪元Axx年 <br> 纪元Bxx年
    const eraYearsHtml = activeEras.map(era => {
        let eraYear;
        if (era.type === 'precise') {
            eraYear = '元年';
        } else if (era.start === -Infinity) {
            eraYear = year > 0 ? `${year}年` : `前${Math.abs(year)}年`;
        } else {
            const y = year - era.start + 1;
            eraYear = y === 1 ? '元年' : y + '年';
        }
        return activeEras.length > 1 ? `${era.name}${eraYear}` : eraYear;
    }).join('<br>');
    
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

function createStars() {}

document.addEventListener('DOMContentLoaded', init);

 
