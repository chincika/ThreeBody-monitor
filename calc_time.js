const start = new Date('1982-01-01');
const end = new Date('2381-08-31');
const diffMs = end - start;
const years = diffMs / (365.25 * 24 * 3600 * 1000);
console.log('Total Years:', years);

// Calculate phase adjustments
const originalTotal = 450;
const reduction = originalTotal - years;
console.log('Reduction:', reduction);

const phase2Original = 200;
const phase4Original = 200;
const phase3Original = 50;
const phase1Original = 7 / 365.25;

const newPhase2 = phase2Original - (reduction / 2);
const newPhase4 = phase4Original - (reduction / 2);

console.log('New Phase 2:', newPhase2);
console.log('New Phase 4:', newPhase4);
console.log('Check Total:', newPhase2 + newPhase4 + phase3Original + phase1Original);
