const fs = require('fs');
const filePath = 'src/services/databaseService.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Replace `, [a, b, c])` with `, a, b, c)`
code = code.replace(/,\s*\[([^\]]+)\]\s*\)/g, ', $1)');

fs.writeFileSync(filePath, code);
console.log('Successfully fixed arrays!');
