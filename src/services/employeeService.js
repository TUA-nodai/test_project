// src/services/employeeService.js
const { Employee, Payroll, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 従業員の給与データを取得する
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Object[]>} 給与データ配列
 */
exports.getEmployeePayroll = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId);
    
    if (!employee) {
      return null;
    }
    
    const payrollData = await Payroll.findAll({
      where: { employeeId }
    });
    
    return payrollData;
  } catch (error) {
    console.error('従業員の給与データ取得エラー:', error);
    throw error;
  }
};

/**
 * 従業員を検索する
 * @param {string} name - 検索する名前（部分一致）
 * @param {string} department - 検索する部署
 * @param {string} position - 検索する役職
 * @returns {Promise<Object[]>} 従業員データ配列
 */
exports.searchEmployees = async (name, department, position) => {
  try {
    const whereClause = {};
    
    if (name) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${name}%` } },
        { lastName: { [Op.iLike]: `%${name}%` } }
      ];
    }
    
    if (department) {
      whereClause.department = department;
    }
    
    if (position) {
      whereClause.position = position;
    }
    
    const employees = await Employee.findAll({
      where: whereClause
    });
    
    return employees;
  } catch (error) {
    console.error('従業員検索エラー:', error);
    throw error;
  }
};

/**
 * 部署ごとの従業員数を取得する
 * @returns {Promise<Object[]>} 部署別従業員数
 */
exports.getEmployeeCountByDepartment = async () => {
  try {
    const result = await Employee.findAll({
      attributes: [
        'department',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['department']
    });
    
    return result;
  } catch (error) {
    console.error('部署ごとの従業員数取得エラー:', error);
    throw error;
  }
};

/**
 * 従業員の詳細情報を取得する（関連データを含む）
 * @param {string} employeeId - 従業員ID
 * @returns {Promise<Object>} 従業員詳細データ
 */
exports.getEmployeeDetails = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId, {
      include: [
        {
          model: Payroll,
          as: 'payrolls'
        }
        // 他の関連モデルもここに追加可能
      ]
    });
    
    if (!employee) {
      return null;
    }
    
    return employee;
  } catch (error) {
    console.error('従業員詳細情報取得エラー:', error);
    throw error;
  }
};

/**
 * 従業員の統計情報を取得する
 * @returns {Promise<Object>} 統計情報
 */
exports.getEmployeeStatistics = async () => {
  try {
    const totalCount = await Employee.count();
    const departmentCounts = await this.getEmployeeCountByDepartment();
    const activeCount = await Employee.count({ where: { isActive: true } });
    
    return {
      totalEmployees: totalCount,
      activeEmployees: activeCount,
      departmentDistribution: departmentCounts
    };
  } catch (error) {
    console.error('従業員統計情報取得エラー:', error);
    throw error;
  }
};
