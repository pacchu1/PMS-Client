// services/paySlipService.js
const mongoose = require('mongoose');
const PaySlip = require('../models/PayrollModel');


const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
const PaySlipService = {
  generatePayslipsForNextMonth: async () => {
    try {
        // Fetch all existing employees from the database
        const employees = await PaySlip.find();
    
        for (const employee of employees) {
          const {
            employeeId,
            year,
            month,
            houseRentAllowance,
            medicalAllowance,
            dearnessAllowance,
            travellingAllowance,
            basicSalary,
            pf,
            professionalTax,
            others
          } = employee;
    
          // Calculate the next month
          const nextMonthIndex = (months.indexOf(month) + 1) % months.length;
          const nextMonth = months[nextMonthIndex];
          const nextYear = nextMonthIndex === 0 ? year + 1 : year;
    
          // Check if payslip already exists for the next month
          const existingPaySlip = await PaySlip.findOne({ employeeId, year: nextYear, month: nextMonth });
    
          if (!existingPaySlip) {
            const grossSalary =
              parseInt(houseRentAllowance) +
              parseInt(medicalAllowance) +
              parseInt(dearnessAllowance) +
              parseInt(travellingAllowance) +
              parseInt(basicSalary);
    
            const netSalary =
              grossSalary - (parseInt(pf) + parseInt(professionalTax) + parseInt(others));
    
            const totalAllowance =
              parseInt(houseRentAllowance) +
              parseInt(medicalAllowance) +
              parseInt(dearnessAllowance) +
              parseInt(travellingAllowance);
    
            // Create a new payslip for the next month
            const newPaySlipData = {
              ...employee.toObject(),  // Convert Mongoose document to plain JavaScript object
              _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the new document
              year: nextYear,
              month: nextMonth,
              grossSalary,
              netSalary,
              totalAllowance
            };
    
            const newPaySlip = await PaySlip.create(newPaySlipData);
            console.log('New Pay Slip for the next month:', newPaySlip);
    
          } else {
            console.log('Payslip already exists for the next month:', existingPaySlip);
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
  },
};

module.exports = PaySlipService;
