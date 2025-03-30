// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
// src/app.js に以下を追加
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
/*/ app.js（既存ファイルに追加）
if (process.env.NODE_ENV === 'development') {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  const proxySettings = require('./config/proxy').development;
  
  // 各プロキシ設定を適用
  Object.keys(proxySettings).forEach(path => {
    app.use(path, createProxyMiddleware(proxySettings[path]));
  });
}
*/

// ミドルウェアの設定
app.use(helmet()); // セキュリティヘッダーの設定
app.use(cors());   // CORSの有効化
app.use(morgan('dev')); // リクエストロギング
app.use(express.json()); // JSONボディパーサー
app.use(express.urlencoded({ extended: true }));
// 他のミドルウェア設定の後に追加
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// APIルートの設定
app.use('/api', routes.api);

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'Express Sequelize APIへようこそ！' });
});

// 明示的な404エラーハンドリング - 特定のAPIパスが見つからない場合
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: '要求されたAPIリソースが見つかりません',
    path: req.originalUrl 
  });
});

// 404エラーハンドラー
app.use((req, res) => {
  res.status(404).json({ message: 'ルートが見つかりません' });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'サーバーエラーが発生しました',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
