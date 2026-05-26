const fs = require('fs');
let code = fs.readFileSync('src/screens/Planner.tsx', 'utf8');

// 1. Add useTheme import
if (!code.includes("import { useTheme }")) {
    code = code.replace(
        "import { useSubjectStore, usePlannerStore, useDashboardStore } from '../store';",
        "import { useSubjectStore, usePlannerStore, useDashboardStore } from '../store';\nimport { useTheme } from '../context/ThemeProvider';"
    );
}

// 2. Replace C and STATUS_META declarations
const replaceTokens = `// ─── Design Tokens ─────────────────────────────────────────────────────────────
export function usePlannerTheme() {
    const { isDark } = useTheme();
    return useMemo(() => ({
        bg:         isDark ? '#121212' : '#f5f5f5',
        surface:    isDark ? '#1e1e1e' : '#ffffff',
        card:       isDark ? '#1e1e1e' : '#ffffff',
        cardBorder: isDark ? '#333333' : '#e0e0e0',
        accent:     isDark ? '#ce93d8' : '#1a237e',
        accentDim:  isDark ? 'rgba(206,147,216,0.15)' : 'rgba(26,35,126,0.1)',
        success:    '#4caf50',
        successDim: 'rgba(76,175,80,0.15)',
        warning:    '#ff9800',
        warningDim: 'rgba(255,152,0,0.15)',
        danger:     '#f44336',
        dangerDim:  '#f4433615',
        purple:     '#9c27b0',
        text:       isDark ? '#ffffff' : '#212121',
        textSub:    isDark ? '#b0bec5' : '#757575',
        textMuted:  isDark ? '#78909c' : '#9e9e9e',
    }), [isDark]);
}

export function getStatusMeta(C: ReturnType<typeof usePlannerTheme>) {
    return {
        PENDING:     { label: 'Pending',     color: C.textMuted,  dim: \`\${C.textMuted}20\`,  next: 'IN_PROGRESS' as const },
        IN_PROGRESS: { label: 'In Progress', color: C.accent,     dim: C.accentDim,         next: 'COMPLETED' as const },
        COMPLETED:   { label: 'Done',        color: C.success,    dim: C.successDim,        next: 'PENDING' as const },
        NEXT_UP:     { label: 'Next Up',     color: C.warning,    dim: C.warningDim,        next: 'IN_PROGRESS' as const },
    };
}`;

code = code.replace(/\/\/ ─── Design Tokens ─────────────────────────────────────────────────────────────[\s\S]*?NEXT_UP:[^\n]*\n};\n/, replaceTokens + '\n');

// 3. Inject C into components
const components = [
    'function SectionLabel({ text }: { text: string }) {',
    'function TabBar({ active, onChange }: {\\n    active: \\'planner\\' | \\'schedule\\';\\n    onChange: (t: \\'planner\\' | \\'schedule\\') => void;\\n}) {',
    'function Bar({ value, max, color = C.accent }: { value: number; max: number; color?: string }) {',
    '    const DAY_LABELS = [\\'MON\\', \\'TUE\\', \\'WED\\', \\'THU\\', \\'FRI\\', \\'SAT\\', \\'SUN\\'];', // inside WeekStrip
    'function ScheduleCard({\\n    item, onCycleStatus, onDelete, onReschedule,\\n}: { item: any; onCycleStatus: () => void; onDelete: () => void; onReschedule: () => void }) {',
    '    const [title,     setTitle]     = useState(\\'\\');', // inside AddScheduleModal
    '    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});', // inside PlannerTab
    '    const { streak } = useDashboardStore();', // inside ScheduleTab
    '    const [activeTab,       setActiveTab]       = useState<\\'planner\\' | \\'schedule\\'>(\\'planner\\');' // inside Planner
];

const injections = [
    'function SectionLabel({ text }: { text: string }) {\n    const C = usePlannerTheme();',
    'function TabBar({ active, onChange }: {\n    active: \'planner\' | \'schedule\';\n    onChange: (t: \'planner\' | \'schedule\') => void;\n}) {\n    const C = usePlannerTheme();',
    'function Bar({ value, max, color }: { value: number; max: number; color?: string }) {\n    const C = usePlannerTheme();\n    color = color || C.accent;',
    '    const C = usePlannerTheme();\n    const DAY_LABELS = [\'MON\', \'TUE\', \'WED\', \'THU\', \'FRI\', \'SAT\', \'SUN\'];',
    'function ScheduleCard({\n    item, onCycleStatus, onDelete, onReschedule,\n}: { item: any; onCycleStatus: () => void; onDelete: () => void; onReschedule: () => void }) {\n    const C = usePlannerTheme();\n    const STATUS_META = getStatusMeta(C);',
    '    const C = usePlannerTheme();\n    const [title,     setTitle]     = useState(\'\');',
    '    const C = usePlannerTheme();\n    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});',
    '    const { streak } = useDashboardStore();\n    const C = usePlannerTheme();\n    const STATUS_META = getStatusMeta(C);',
    '    const [activeTab,       setActiveTab]       = useState<\'planner\' | \'schedule\'>(\'planner\');\n    const C = usePlannerTheme();'
];

for (let i = 0; i < components.length; i++) {
    if (code.includes(components[i])) {
        code = code.replace(components[i], injections[i]);
    } else {
        console.error("Could not find component to patch:", components[i]);
    }
}

// 4. Update the StatusBar default barStyle in Planner
code = code.replace(
    '<StatusBar barStyle="light-content" backgroundColor={C.bg} />',
    '<StatusBar barStyle={C.bg === \\'#f5f5f5\\' ? "dark-content" : "light-content"} backgroundColor={C.bg} />'
);

fs.writeFileSync('src/screens/Planner.tsx', code);
console.log("Patched successfully");
