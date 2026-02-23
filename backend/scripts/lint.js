const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'src');

const walk = (dir) => {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (item.isFile() && item.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
};

const files = walk(ROOT);
let hasError = false;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    hasError = true;
    console.error(`Syntax error in ${path.relative(process.cwd(), file)}:`);
    console.error(error.message);
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Backend lint (syntax) passed for ${files.length} files.`);
