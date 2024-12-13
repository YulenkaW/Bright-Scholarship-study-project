// src/components/ApplicantsList.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './ApplicantsList.module.css';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applicants');
        setApplicants(response.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, []);

  return (
    <div className={styles.applicantsContainer}>
      <h3>Applicants List</h3>
      <table className={styles.applicantsTable}>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Cumulative GPA</th>
            <th>Credit Hours</th>
            <th>Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.student_number}>
              <td>{applicant.student_number}</td>
              <td>{`${applicant.first_name} ${applicant.last_name}`}</td>
              <td>{applicant.email_address}</td>
              <td>{applicant.status}</td>
              <td>{applicant.cumulative_gpa}</td>
              <td>{applicant.credit_hours}</td>
              <td>{applicant.eligibility_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsList;
