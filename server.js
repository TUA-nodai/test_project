// server.js
require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

// データベース同期してからサーバー起動
sequelize.sync({ force: false })
  .then(() => {
    console.log('データベースと同期しました');
    app.listen(PORT, () => {
      console.log(`サーバーが起動しました：ポート ${PORT}`);
    });
  })
  .catch(err => {
    console.error('データベース同期に失敗しました:', err);
  });
