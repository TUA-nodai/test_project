// src/controllers/payrollController.js
const { Payroll, Employee } = require('../models');
const { Op } = require('sequelize');

// 給与データ一覧を取得
exports.getAllPayrolls = async (req, res, next) => {
    try {
      const payrolls = await Payroll.findAll({
        include: [
          {
            model: Employee,
            as: 'employees', // アソシエーションで定義した名前と一致させる
            attributes: ['objectid', 'name', 'base_rate', 'transport_cost'] // 実際のカラム名を使用
          }
        ]
      });
      return res.json(payrolls);
    } catch (error) {
      next(error);
    }
  };

// IDによる給与データ取得
exports.getPayrollById = async (req, res, next) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          as: 'employees',
          attributes: ['objectid', 'name', 'base_rate', 'transport_cost'] // 実際のカラム名を使用
        }
      ]
    });
    
    if (!payroll) {
      return res.status(404).json({ message: '給与データが見つかりません' });
    }
    
    return res.json(payroll);
  } catch (error) {
    next(error);
  }
};

// 新規給与データ作成
exports.createPayroll = async (req, res, next) => {
  try {
    const payrollData = req.body;
    
    // 関連する従業員が存在するか確認
    const employee = await Employee.findByPk(payrollData.employeeId);
    if (!employee) {
      return res.status(404).json({ message: '指定された従業員が見つかりません' });
    }
    
    const payroll = await Payroll.create(payrollData);
    return res.status(201).json(payroll);
  } catch (error) {
    next(error);
  }
};

// 給与データ更新
exports.updatePayroll = async (req, res, next) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({ message: '給与データが見つかりません' });
    }
    
    const updatedPayroll = await payroll.update(req.body);
    return res.json(updatedPayroll);
  } catch (error) {
    next(error);
  }
};

// 給与データ削除
exports.deletePayroll = async (req, res, next) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({ message: '給与データが見つかりません' });
    }
    
    await payroll.destroy();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// 給与計算
exports.calculatePayroll = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate } = req.body;
    
    // 従業員が存在するか確認
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: '指定された従業員が見つかりません' });
    }
    
    // 給与計算ロジック（実際のプロジェクトではサービス層に分離）
    const calculatedAmount = 250000; // 仮の計算値
    
    const calculatedPayroll = {
      employeeId,
      startDate,
      endDate,
      amount: calculatedAmount,
      calculatedAt: new Date()
    };
    
    return res.json(calculatedPayroll);
  } catch (error) {
    next(error);
  }
};

// 期間による給与データ検索
exports.getPayrollsByPeriod = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const payrolls = await Payroll.findAll({
      where: {
        paymentDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        {
          model: Employee,
          as: 'employees',
          attributes: ['objectid', 'name', 'base_rate', 'transport_cost'] // 実際のカラム名を使用
        }
      ]
    });
    
    return res.json(payrolls);
  } catch (error) {
    next(error);
  }
};
