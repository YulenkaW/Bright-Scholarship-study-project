const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');


// Configure mailfog
// Configure Nodemailer for MailHog
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // MailHog SMTP port
  secure: false, // No SSL/TLS for MailHog
});



// Function to determine the awardee
const determineAwardee = async () => {
  const [applicants] = await db.execute(
    'SELECT * FROM Applicants WHERE eligibility_status = "Eligible"'
  );
  console.log('Eligible applicants:', applicants);

  if (!applicants || applicants.length === 0) {
    throw new Error('No eligible applicants.');
  }

  // Step 1: Highest cumulative GPA
  const highestGPA = Math.max(...applicants.map(a => parseFloat(a.cumulative_gpa || 0)));
  let topApplicants = applicants.filter(a => parseFloat(a.cumulative_gpa || 0) === highestGPA);
  if (topApplicants.length === 0) {
    throw new Error('No valid top applicants found after GPA comparison.');
  }

  console.log('After highest GPA filter:', topApplicants);

  // Step 2: Tie-breaking with current semester GPA
  if (topApplicants.length > 1) {
    const highestSemesterGPA = Math.max(
      ...topApplicants.map(a => parseFloat(a.current_semester_gpa || 0))
    );
    topApplicants = topApplicants.filter(
      a => parseFloat(a.current_semester_gpa || 0) === highestSemesterGPA
    );
  }

  console.log('After current semester GPA filter:', topApplicants);

  // Step 3: Prefer junior status
  const juniors = topApplicants.filter(a => a.status === 'Junior');
  if (juniors.length > 0) {
    topApplicants = juniors;
  }

  console.log('After Junior filter:', topApplicants);

  // Step 4: Prefer female candidates
  const females = topApplicants.filter(a => a.gender === 'Female');
  if (females.length > 0) {
    topApplicants = females;
  }

  console.log('After Female preference filter:', topApplicants);

  // Step 5: Sort by youngest (date_of_birth descending)
  topApplicants.sort((a, b) => new Date(b.date_of_birth) - new Date(a.date_of_birth));
  console.log('After sorting by youngest:', topApplicants);

  if (topApplicants.length === 0) {
    throw new Error('No valid applicants remain after all tie-breaking steps.');
  }

  return topApplicants[0]; // Return the top-ranked applicant
};

// Award scholarship
router.post('/process', async (req, res) => {
  console.log('POST /api/award/process triggered');

  try {
    const awardee = await determineAwardee();
    console.log('Awardee determined:', awardee);

    if (!awardee) {
      throw new Error('No awardee could be determined.');
    }

    const awardDate = new Date();

    await db.execute(
      'INSERT INTO Awarded (student_number, full_name, awarded_amount, award_date) VALUES (?, ?, ?, ?)',
      [
        awardee.student_number,
        `${awardee.first_name} ${awardee.last_name}`,
        1000,
        awardDate,
      ]
    );

    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: awardee.email_address,
      subject: 'Congratulations on Your Bright Scholarship!',
      text: `Dear ${awardee.first_name},\n\nYou have been awarded the Bright Scholarship!\n\nBest regards,\nBright Scholarship Committee`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        throw new Error('Failed to send congratulatory email.');
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: 'Scholarship awarded successfully.' });
    return;
  } catch (error) {
    console.error('Error awarding scholarship:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || 'Server error.' });
    }
  }
});

module.exports = router;
