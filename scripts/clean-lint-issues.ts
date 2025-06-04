import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

const BASE_DIR = path.resolve(__dirname, '../backend/src');




const replaceInFile = (file: string, replacer: (content: string) => string) => {
  const content = fs.readFileSync(file, 'utf-8');
  const updated = replacer(content);
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf-8');
    console.log(`✔ Updated: ${file}`);
  }
};

const replaceAny = (content: string) => {
  return content.replace(/\bany\b/g, 'unknown /* TODO: refine type */');
};

const removeUnusedImports = (content: string) => {
  return content
    .split('\n')
    .filter((line) => {
      return !/^\s*(import|const|let|var)\s+[^=]+=\s+require\([^)]+\);?\s*$/.test(line) ||
        !/['"]fastify.*['"]/.test(line);
    })
    .filter((line) => !/import\s+{\s*[^}]+}\s+from\s+['"][^'"]+['"]/.test(line) || !line.includes('verifyAuth'))
    .join('\n');
};

const warnNonNullAssertion = (content: string, file: string) => {
  if (content.includes('!')) {
    console.warn(`⚠️  Warning: Non-null assertion found in ${file}`);
  }
  return content;
};

const processFiles = async () => {
  const tsFiles = await glob(`${BASE_DIR}/**/*.ts`);

  for (const file of tsFiles) {
    replaceInFile(file, (content) => {
      let updated = replaceAny(content);
      updated = removeUnusedImports(updated);
      updated = warnNonNullAssertion(updated, file);
      return updated;
    });
  }

  console.log('\n✅ Static fixes applied. Running eslint --fix...\n');
  require('child_process').execSync(`npx eslint ${BASE_DIR} --fix`, { stdio: 'inherit' });

};


processFiles();
