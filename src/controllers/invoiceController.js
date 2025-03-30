const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const employeeRoutes = require('./employeeRoutes');
const payrollRoutes = require('./payrollRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const assignmentRoutes = require('./assignmentRoutes');

router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/payroll', payrollRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/assignments', assignmentRoutes);

// ... 他のコード ...

module.exports = router;
