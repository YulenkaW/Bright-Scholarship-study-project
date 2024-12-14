// src/components/AwardScholarship.js
import axios from 'axios';
import React, { useState } from 'react';
import styles from './AwardScholarship.module.css';

const AwardScholarship = () => {
  const [message, setMessage] = useState('');

  const handleAwardProcess = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/award/process');
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing award.');
    }
  };

  return (
    <div className={styles.awardContainer}>
      <button className={styles.processAwardButton} onClick={handleAwardProcess}>
        Process Award
      </button>
      {message && <p className={styles.successMessage}>{message}</p>}
    </div>
  );
};

export default AwardScholarship;
