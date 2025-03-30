// src/controllers/employeeController.js
const { Employee, Payroll } = require('../models');
const employeeService = require('../services/employeeService');

// 従業員一覧を取得
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    return res.json(employees);
  } catch (error) {
    next(error);
  }
};

// IDによる従業員取得
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: '従業員が見つかりません' });
    }
    
    return res.json(employee);
  } catch (error) {
    next(error);
  }
};

// 新規従業員作成
exports.createEmployee = async (req, res, next) => {
  try {
    const employeeData = req.body;
    const employee = await Employee.create(employeeData);
    return res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// 従業員情報更新
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: '従業員が見つかりません' });
    }
    
    const updatedEmployee = await employee.update(req.body);
    return res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// 従業員削除
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: '従業員が見つかりません' });
    }
    
    await employee.destroy();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// 従業員の給与データを取得
exports.getEmployeePayroll = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const payrollData = await employeeService.getEmployeePayroll(employeeId);
    
    if (!payrollData) {
      return res.status(404).json({ message: '給与データが見つかりません' });
    }
    
    return res.json(payrollData);
  } catch (error) {
    next(error);
  }
};

// 従業員検索
exports.searchEmployees = async (req, res, next) => {
  try {
    const { name, department, position } = req.query;
    const employees = await employeeService.searchEmployees(name, department, position);
    return res.json(employees);
  } catch (error) {
    next(error);
  }
};
