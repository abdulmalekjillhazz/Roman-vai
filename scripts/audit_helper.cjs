const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') walk(p, fileList);
    } else if (/\.(jsx?|tsx?)$/.test(file)) {
      fileList.push(p);
    }
  }
  return fileList;
}

const files = [...walk('src'), ...walk('app')];

console.log('--- CTA BUTTON STYLES ---');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if ((line.includes('<button') || line.includes('<a') || line.includes('className=')) && (line.includes('rounded') || line.includes('bg-') || line.includes('btn-'))) {
      if (line.includes('gold') || line.includes('brand-') || line.includes('btn-luxury') || line.includes('#E5A924') || line.includes('#d4b77a') || line.includes('#25D366') || line.includes('bg-stone-900') || line.includes('bg-brand-charcoal')) {
        console.log(`${file.replace(/\\/g, '/')}:${idx + 1} | ${line.trim().slice(0, 140)}`);
      }
    }
  });
});
