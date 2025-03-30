// src/routes/api.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./auth.routes'); // 認証ルートを追加

// 新しいルートを追加（これらのファイルはこれから作成）
const employeeRoutes = require('./employeeRoutes');
const payrollRoutes = require('./payrollRoutes');

// 各ルートを登録
router.use('/auth', authRoutes); // 認証ルートの登録
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/payroll', payrollRoutes);

// APIの基本情報
router.get('/', (req, res) => {
  res.json({
    message: 'API is working!',
    version: '1.0.0',
    endpoints: [
      '/auth/login',
      '/users',
      '/employees',
      '/payroll',
      '/employees/:id/payroll'
    ]
  });
});

module.exports = router;
