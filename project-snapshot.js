// project-snapshot.js
// このスクリプトは指定したファイルの内容とプロジェクト構造を
// Perplexityで共有しやすい形式で出力します
const fs = require('fs');
const path = require('path');

// 重要ファイルリスト
const filesToInclude = [
  'src/app.js',
  'src/routes/user.routes.js',
  'src/controllers/user.controller.js'
];

// 出力ファイル
const output = ['# プロジェクト状態スナップショット\n'];

// ファイル内容の取得
filesToInclude.forEach(file => {
  output.push(`## ${file}\n`);
  output.push('```\n' + fs.readFileSync(file, 'utf8') + '\n```\n');
});

// 出力
fs.writeFileSync('project-snapshot.md', output.join('\n'));
