const fs = require('fs');
const path = require('path');

async function countLinesInFile(filePath) {
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

function countLines() {
  const owner = document.getElementById("owner").value;
  const repo = document.getElementById("repo").value;
  const token = document.getElementById("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").value;

  // Faça uma solicitação HTTP para a API do GitHub
  const response = fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Processe a resposta HTTP
  response.json().then(data => {
    // Obtenha o número de linhas de código
    let totalLines = 0;
    for (const file of data) {
      if (file.type === "file") {
        const filePath = file.download_url;
        const lines = await countLinesInFile(filePath);
        totalLines += lines;
      }
    }

    // Exiba o número de linhas de código em uma janela popup
    const popup = window.open('', 'popup', 'width=500,height=200');
    popup.document.write(`Total lines in all files: ${totalLines}`);
  });
}