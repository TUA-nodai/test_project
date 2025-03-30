// config/proxy.js
module.exports = {
    // 開発向けプロキシ設定
    development: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        // 環境変数からプロキシサーバー設定を取得（必要に応じて）
        proxy: process.env.HTTP_PROXY || null,
      },
      // 必要に応じて他のエンドポイントも追加
    }
  };
  