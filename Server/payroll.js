const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/payrollDB', { useNewUrlParser: true, useUnifiedTopology: true });

const paySlipSchema = new mongoose.Schema({
  employeeName: String,
  employeeId: String,
  accountNumber: String,
  bankName: String,
  UANNumber: String,
  workingDays: Number,
  department: String,
  designation: String,
  year: Number,
  month: String,
  houseRentAllowance: Number,
  medicalAllowance: Number,
  dearnessAllowance: Number,
  travellingAllowance: Number,
  basicSalary: Number,
  grossSalary: Number,
  netSalary: Number,
  totalAllowance: Number,
  pf: Number,
  professionalTax: Number,
  others: Number
});

const PaySlip = mongoose.model('PaySlip', paySlipSchema);

app.post('/api/payslip', async (req, res) => {
  try {
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
});

app.get('/api/payslip', async (req, res) => {
  try {
    const payslips = await PaySlip.find();
    res.status(200).json(payslips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});