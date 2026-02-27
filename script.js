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

let CURRENT_SPEED_PERCENT = 0;


function init() {
    updateDashboard();
    setInterval(updateDashboard, 100); // High refresh rate for smooth numbers
    createStars();
}

function updateDashboard() {
    const now = new Date();
    
    // 1. 更新纪元
    updateEra(now);

    // 2. 更新航行数据
    updateFleetStatus(now);
}

function updateEra(date) {
    const year = date.getFullYear();
    const timestamp = date.getTime();
    
    let currentEra = ERAS[0]; // Default
    
    // 查找匹配的纪元
    // 特殊处理魔法时代 (精确时间)
    const magicEra = ERAS.find(e => e.name === '魔法时代');
    if (timestamp >= magicEra.start && timestamp <= magicEra.end) {
        currentEra = magicEra;
    } else {
        // 普通年份匹配
        for (let i = ERAS.length - 1; i >= 0; i--) {
            const era = ERAS[i];
            if (era.type === 'normal') {
                if (year >= era.start) {
                    // 如果有end且year > end，说明不是这个纪元(除非是最后一个)
                    if (era.end && year > era.end && i < ERAS.length - 1) continue;
                    currentEra = era;
                    break;
                }
            }
        }
    }

    document.getElementById('eraName').textContent = currentEra.name;
    
    // 计算纪元内年份和日期时间
    let eraYearNumStr = '';
    let eraDateTimeStr = '';
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;
    const dateStr = `${month}月${day}日`;

    if (currentEra.name === '魔法时代') {
        // 魔法时代非常短暂
        eraYearNumStr = ''; 
        eraDateTimeStr = `${dateStr} ${timeStr}`;
    } else if (currentEra.start === -Infinity) {
        // 公元前/公元
        eraYearNumStr = year > 0 ? `${year}年` : `前${Math.abs(year)}年`;
        eraDateTimeStr = `${dateStr} ${timeStr}`;
    } else {
        // 其他纪元：计算偏移年份
        const eraYearNum = year - currentEra.start + 1;
        eraYearNumStr = `${eraYearNum}年`;
        eraDateTimeStr = `${dateStr} ${timeStr}`;
    }
    
    // 分别显示年份和日期时间
    document.getElementById('eraYearNum').textContent = eraYearNumStr;
    document.getElementById('eraDateTime').textContent = eraDateTimeStr;
    
    // 公元时间作为参考
    document.getElementById('commonYear').textContent = `(参考: 公元 ${year}年${month}月${day}日 ${timeStr})`;
    
    // 隐藏原来的独立时间显示，因为已经包含在纪元时间里了
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

    for (let i = 0; i < PHASE_META.length; i++) {
        if (elapsedYears < PHASE_META[i].endTime) {
            currentPhase = PHASE_META[i];
            phaseIndex = i;
            break;
        }
    }

    // 计算当前速度和距离
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
    document.getElementById('distanceValue').textContent = '距太阳系 ' + remainingLy.toFixed(4) + ' 光年';
    const remainingKm = remainingLy * LY_TO_KM;
    // Show decimals for km to see movement
    document.getElementById('distanceKm').textContent = remainingKm.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' km';
    
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

 
