const fs = require('fs');
let code = fs.readFileSync('src/screens/Planner.tsx', 'utf8');

const startIndex = code.indexOf('// ─── Design Tokens ─────────────────────────────────────────────────────────────');
const endIndex = code.indexOf('// ─── Planner Tab ───────────────────────────────────────────────────────────────');

if (startIndex !== -1 && endIndex !== -1) {
    const importStatement = `import {
    usePlannerTheme, getStatusMeta, TYPE_ICONS, SUBJECT_ICONS,
    timeToMinutes, pad, SectionLabel, TabBar, Bar, CircularProgress,
    WeekStrip, useElapsedTimer, formatElapsed, ScheduleCard, SchedulePrefill, AddScheduleModal
} from '../components/PlannerShared';\n\n`;

    code = code.substring(0, startIndex) + importStatement + code.substring(endIndex);
    fs.writeFileSync('src/screens/Planner.tsx', code);
    console.log('Successfully patched Planner.tsx');
} else {
    console.error('Could not find start or end markers in Planner.tsx');
}
