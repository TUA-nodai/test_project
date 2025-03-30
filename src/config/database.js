// src/config/database.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres', // または 'mysql'
    logging: console.log,
    define: {
      timestamps: true, // createdAt、updatedAtを自動追加
      underscored: true, // カラム名をスネークケースに
    },
  },
  test: {
    // テスト環境設定
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    dialect: 'postgres', // または 'mysql'
    logging: false,
  },
  production: {
    // 本番環境設定
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres', // または 'mysql'
    logging: false,
  },
};
