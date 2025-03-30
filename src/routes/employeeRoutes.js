// src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: 従業員一覧の取得
 *     responses:
 *       200:
 *         description: 従業員一覧を返します
 */
router.get('/', employeeController.getAllEmployees);

/**
 * @swagger
 * /employees/search:
 *   get:
 *     summary: 従業員の検索
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 検索条件に一致する従業員一覧を返します
 */
router.get('/search', employeeController.searchEmployees);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: IDで従業員を取得
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 従業員情報
 *       404:
 *         description: 従業員が見つかりません
 */
router.get('/:id', employeeController.getEmployeeById);

/**
 * @swagger
 * /employees/{id}/payroll:
 *   get:
 *     summary: 従業員の給与データを取得
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 従業員の給与データ
 *       404:
 *         description: データが見つかりません
 */
router.get('/:id/payroll', employeeController.getEmployeePayroll);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: 新規従業員を作成
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: 従業員が作成されました
 *       400:
 *         description: 無効なリクエストデータ
 */
router.post('/', employeeController.createEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: 従業員情報を更新
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
 *         description: 従業員情報が更新されました
 *       404:
 *         description: 従業員が見つかりません
 */
router.put('/:id', employeeController.updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: 従業員を削除
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 従業員が削除されました
 *       404:
 *         description: 従業員が見つかりません
 */
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
