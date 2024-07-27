const PaySlip = require('../models/PayrollModel');
const path = require('path');

const createPaySlip = async (req, res) => {
  try {
    const {
      employeeId,
      year,
      month,
      workingDays,
      PanNumber,
      houseRentAllowance,
      medicalAllowance,
      dearnessAllowance,
      travellingAllowance,
      basicSalary,
      pf,
      professionalTax,
      others,
      joiningDate,
    } = req.body;

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

    let existingPaySlip = await PaySlip.findOne({ employeeId, year, month });

    if (!existingPaySlip) {
      const newPaySlipData = {
        ...req.body,
        grossSalary,
        netSalary,
        totalAllowance
      };

      existingPaySlip = await PaySlip.create(newPaySlipData);
      console.log('New Pay Slip:', existingPaySlip);
      res.status(201).json(existingPaySlip);
    } else {
      // Update existing payslip with the calculated values
      existingPaySlip.employeeId = employeeId;
      existingPaySlip.year = year;
      existingPaySlip.month = month;
      existingPaySlip.workingDays = workingDays;
      existingPaySlip.PanNumber = PanNumber;
      existingPaySlip.joiningDate = joiningDate;
      existingPaySlip.houseRentAllowance = houseRentAllowance;
      existingPaySlip.medicalAllowance = medicalAllowance;
      existingPaySlip.dearnessAllowance = dearnessAllowance;
      existingPaySlip.travellingAllowance = travellingAllowance;
      existingPaySlip.basicSalary = basicSalary;
      existingPaySlip.pf = pf;
      existingPaySlip.professionalTax = professionalTax;
      existingPaySlip.others = others;
      existingPaySlip.grossSalary = grossSalary;
      existingPaySlip.netSalary = netSalary;
      existingPaySlip.totalAllowance = totalAllowance;

      await existingPaySlip.save();
      console.log('Updated Pay Slip:', existingPaySlip);
      res.status(200).json(existingPaySlip);
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }

}
const getPayslip = async (req, res) => {
  try {
    const payslips = await PaySlip.find();
    res.status(200).json(payslips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getPayslipForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const payslips = await PaySlip.find({ employeeId });
    res.status(200).json(payslips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  createPaySlip,
  getPayslip,
  getPayslipForEmployee,
};
