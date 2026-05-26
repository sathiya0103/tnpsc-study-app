const fs = require('fs');
const filePath = 'src/services/databaseService.ts';
let code = fs.readFileSync(filePath, 'utf8');

// We intentionally reverse the previous fix. `expo-sqlite` 16.0.10 STRICLY EXPECTS ARRAYS.
// It throws NullPointerException across the bridge when a javascript vararg layout (e.g. 3 args)
// is sent instead of a unified single array object holding the bindings.
const regex = /,\s*([^\[\]\)\n]+\b)\s*\)/g;
code = code.replace(regex, (match, args) => {
    if (args.trim().startsWith('[')) return match;
    return `, [${args}])`;
});

fs.writeFileSync(filePath, code);
console.log('Arrays successfully restored!');
