// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Sequelize API',
    version: '1.0.0',
    description: 'RESTful API with Express and Sequelize',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: '開発サーバー',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // ルートファイルからAPI定義を生成
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
