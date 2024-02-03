const fs = require('fs').promises;
const fssync = require('fs');
const path = require('path');
const glob = require('glob');

const isDirectory = (importPath) => {
  try {
    const stat = fssync.statSync(importPath);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
};

const updateFileImports = async (file) => {
  try {
    let data = await fs.readFile(file, 'utf8');
    const updatedData = data.replace(/from\s+['"](\.\/|\.\.\/)([^'"]+?)['"];/g, (match, p1, p2) => {
      const fullPath = path.resolve(path.dirname(file), `${p1}${p2}`);

      if (isDirectory(fullPath)) {
        return `from '${p1}${p2}/index.js';`;
      } else if (!p2.endsWith('.js')) {
        return `from '${p1}${p2}.js';`;
      }
      return match;
    });

    if (data !== updatedData) {
      await fs.writeFile(file, updatedData, 'utf8');
      //console.log(`Updated imports in ${file}`);
    }
  } catch (err) {
    console.error(`Error processing file ${file}: `, err);
  }
};

const updateImports = async (dir) => {
  glob(`${dir}/**/*.js`, async (err, files) => {
    if (err) {
      console.error('Error finding files: ', err);
      return;
    }
    await Promise.all(files.map((file) => updateFileImports(file)));
  });
};

// Taking directory path from command line arguments
const directoryPath = process.argv[2];

if (!directoryPath) {
  console.log('Usage: node fix-es.js <directory_path>');
  process.exit(1);
}

updateImports(directoryPath);
