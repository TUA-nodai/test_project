const { executeTransaction } = require('../models/transaction');
const { v4: uuidv4 } = require('uuid');

/**
 * 給与と請求書を同時に作成する統合サービス
 * @param {Object} assignmentData 作業データ
 * @param {Array<string>} employeeIds 従業員IDの配列
 * @returns {Promise<Object>} 処理結果
 */
async function createAssignmentWithPayrollAndInvoice(assignmentData, employeeIds) {
  return executeTransaction(async (client) => {
    const now = new Date();
    const results = {};
    
    // 1. assignments テーブルに作業情報を登録
    const assignmentId = uuidv4();
    const assignmentQuery = `
      INSERT INTO public.assignments (
        objectid, createdat, updatedat, date, task, location, client_name,
        total_transport_cost, quantity, sales_amount, order_number, site_name,
        hours, unit_price, person_in_charge
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    
    const assignmentValues = [
      assignmentId,
      now,
      now,
      assignmentData.date || now,
      assignmentData.task || '',
      assignmentData.location || '',
      assignmentData.clientName || '',
      assignmentData.totalTransportCost || 0,
      assignmentData.quantity || 0,
      assignmentData.salesAmount || 0,
      assignmentData.orderNumber || '',
      assignmentData.siteName || '',
      assignmentData.hours || 0,
      assignmentData.unitPrice || 0,
      assignmentData.personInCharge || ''
    ];
    
    const assignmentResult = await client.query(assignmentQuery, assignmentValues);
    results.assignment = assignmentResult.rows[0];
    
    // 2. payroll テーブルに給与情報を登録
    const payrollId = uuidv4();
    const payrollQuery = `
      INSERT INTO public.payroll (
        objectid, createdat, updatedat, date, hours, client_name,
        task, person_in_charge, site_name, location, order_number, quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const payrollValues = [
      payrollId,
      now,
      now,
      assignmentData.date || now,
      assignmentData.hours || 0,
      assignmentData.clientName || '',
      assignmentData.task || '',
      assignmentData.personInCharge || '',
      assignmentData.siteName || '',
      assignmentData.location || '',
      assignmentData.orderNumber || '',
      assignmentData.quantity || 0
    ];
    
    const payrollResult = await client.query(payrollQuery, payrollValues);
    results.payroll = payrollResult.rows[0];
    
    // 3. employee_payroll テーブルに従業員と給与の関連付けを登録
    results.employeePayrolls = [];
    for (const employeeId of employeeIds) {
      const linkId = uuidv4();
      const linkQuery = `
        INSERT INTO public.employee_payroll (
          objectid, createdat, updatedat, employee, payroll
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const linkValues = [linkId, now, now, employeeId, payrollId];
      const linkResult = await client.query(linkQuery, linkValues);
      results.employeePayrolls.push(linkResult.rows[0]);
    }
    
    // 4. invoices テーブルに請求情報を登録
    const invoiceId = uuidv4();
    const invoiceQuery = `
      INSERT INTO public.invoices (
        objectid, createdat, updatedat, quantity, order_number,
        product_name, amount, unit_price, date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const invoiceValues = [
      invoiceId,
      now,
      now,
      assignmentData.quantity || 0,
      assignmentData.orderNumber || '',
      assignmentData.task || '', // 作業内容を商品名として使用
      assignmentData.salesAmount || 0,
      assignmentData.unitPrice || 0,
      assignmentData.date || now
    ];
    
    const invoiceResult = await client.query(invoiceQuery, invoiceValues);
    results.invoice = invoiceResult.rows[0];
    
    return results;
  });
}

module.exports = {
  createAssignmentWithPayrollAndInvoice
};
