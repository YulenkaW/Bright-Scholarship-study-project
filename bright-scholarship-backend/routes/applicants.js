const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch Registrar Data for a Single Student
const getRegistrarData = async (student_number) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM RegistrarData WHERE student_number = ?',
      [student_number]
    );
    if (rows.length === 0) {
      throw new Error(`No data found in RegistrarData for student_number: ${student_number}`);
    }
    return rows[0]; // Return the student's data
  } catch (error) {
    console.error('Error fetching Registrar data:', error);
    throw error;
  }
};

// Fetch Registrar Data for All Applicants
router.get('/fetch-registrar-data', async (req, res) => {
  try {
    const [applicants] = await db.execute('SELECT student_number FROM Applicants');
    if (!applicants || applicants.length === 0) {
      return res.status(400).json({ message: 'No applicants found.' });
    }

    const studentNumbers = applicants.map(applicant => applicant.student_number);
    const [registrarData] = await db.execute(
      `SELECT * FROM RegistrarData WHERE student_number IN (${studentNumbers.map(() => '?').join(', ')})`,
      studentNumbers
    );

    res.json(registrarData);
  } catch (error) {
    console.error('Error fetching Registrar data:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Submit an Application
router.post('/submit', async (req, res) => {
  const { student_number, first_name, last_name, phone_number, email_address, date_of_birth } = req.body;

  if (!student_number || !first_name || !last_name || !phone_number || !email_address || !date_of_birth) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  try {
    // Fetch Registrar Data
    const registrarData = await getRegistrarData(student_number);
    console.log('Registrar Data:', registrarData);

    // Check for Existing Applicant
    const [existing] = await db.execute('SELECT * FROM Applicants WHERE student_number = ?', [student_number]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Student already applied.' });
    }

    // Insert into Applicants
    await db.execute(
      `INSERT INTO Applicants (
        student_number,
        first_name,
        last_name,
        phone_number,
        email_address,
        date_of_birth,
        cumulative_gpa,
        credit_hours,
        current_semester_gpa,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_number,
        first_name,
        last_name,
        phone_number,
        email_address,
        date_of_birth,
        registrarData.cumulative_gpa,
        registrarData.credit_hours,
        registrarData.current_semester_gpa,
        registrarData.status,
      ]
    );

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    if (error.message.includes('No data found in RegistrarData')) {
      return res.status(404).json({
        message: `The student with number ${student_number} is not registered in the university.`,
      });
    }

    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get All Applicants
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Applicants');
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Check Eligibility
router.post('/check-eligibility', async (req, res) => {
  try {
    const [applicants] = await db.execute('SELECT * FROM Applicants');
    if (!applicants || applicants.length === 0) {
      return res.status(400).json({ message: 'No applicants found.' });
    }

    for (const applicant of applicants) {
      const { student_number, cumulative_gpa, credit_hours } = applicant;

      // Eligibility Criteria
      const isEligible = cumulative_gpa >= 3.2 && credit_hours >= 12;
      const eligibility = isEligible ? 'Eligible' : 'Non Eligible';

      await db.execute('UPDATE Applicants SET eligibility_status = ? WHERE student_number = ?', [
        eligibility,
        student_number,
      ]);
    }

    res.json({ message: 'Eligibility updated.' });
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
