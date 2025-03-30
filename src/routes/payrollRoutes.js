// src/routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

/**
 * @swagger
 * /payroll:
 *   get:
 *     summary: 給与データ一覧の取得
 *     responses:
 *       200:
 *         description: 給与データ一覧を返します
 */
router.get('/', payrollController.getAllPayrolls);

/**
 * @swagger
 * /payroll/period:
 *   get:
 *     summary: 期間による給与データの検索
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *     responses:
 *       200:
 *         description: 指定期間の給与データを返します
 */
router.get('/period', payrollController.getPayrollsByPeriod);

/**
 * @swagger
 * /payroll/{id}:
 *   get:
 *     summary: IDで給与データを取得
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 給与データ
 *       404:
 *         description: 給与データが見つかりません
 */
router.get('/:id', payrollController.getPayrollById);

/**
 * @swagger
 * /payroll:
 *   post:
 *     summary: 新規給与データを作成
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: 給与データが作成されました
 *       400:
 *         description: 無効なリクエストデータ
 */
router.post('/', payrollController.createPayroll);

/**
 * @swagger
 * /payroll/calculate:
 *   post:
 *     summary: 給与計算を実行
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: 計算された給与データ
 *       400:
 *         description: 無効なリクエストデータ
 *       404:
 *         description: 従業員が見つかりません
 */
router.post('/calculate', payrollController.calculatePayroll);

/**
 * @swagger
 * /payroll/{id}:
 *   put:
 *     summary: 給与データを更新
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 給与データが更新されました
 *       404:
 *         description: 給与データが見つかりません
 */
router.put('/:id', payrollController.updatePayroll);

/**
 * @swagger
 * /payroll/{id}:
 *   delete:
 *     summary: 給与データを削除
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 給与データが削除されました
 *       404:
 *         description: 給与データが見つかりません
 */
router.delete('/:id', payrollController.deletePayroll);

module.exports = router;
