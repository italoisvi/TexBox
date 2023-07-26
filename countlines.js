const fs = require('fs');
const path = require('path');

function countLinesInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  return lines.length;
}

function detectLanguage(extension) {
  const extensionsToLanguages = {
    '.html': 'HTML',
    '.htm': 'HTML',
    '.css': 'CSS',
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'JavaScript (JSX)',
    '.tsx': 'TypeScript (TSX)',
    '.php': 'PHP',
    '.py': 'Python',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.cs': 'C#',
    '.rb': 'Ruby',
    '.swift': 'Swift',
    '.go': 'Go',
    '.rs': 'Rust',
    '.json': 'JSON',
    '.xml': 'XML',
    '.yml': 'YAML',
    '.toml': 'TOML',
    '.md': 'Markdown',
    '.txt': 'Plain Text'
    // Adicione outras extensões e linguagens conforme necessário
  };

  return extensionsToLanguages[extension.toLowerCase()] || 'Unknown';
}

function countLinesInFolder(folderPath, parentPath = '') {
  const files = fs.readdirSync(folderPath);

  let totalLines = 0;
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      const extension = path.extname(file);
      const language = detectLanguage(extension);
      if (language !== 'Unknown') {
        const lines = countLinesInFile(filePath);
        console.log(`${path.join(parentPath, file)} (${language}): ${lines} lines`);
        totalLines += lines;
      }
    } else if (stats.isDirectory()) {
      const linesInSubfolder = countLinesInFolder(filePath, path.join(parentPath, file));
      totalLines += linesInSubfolder;
    }
  }

  return totalLines;
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const folderPath = args[0];
  const totalLines = countLinesInFolder(folderPath);
  console.log(`Total lines in all files: ${totalLines}`);
}