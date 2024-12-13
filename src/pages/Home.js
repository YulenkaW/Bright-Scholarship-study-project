/* src/pages/Home.js */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.homeContainer}>
    <h1>Bright Scholarship Program</h1>
    <p className={styles.tagline}>
      Your Future Starts Here – Turn Your Ambitions into Achievements!
    </p>
    <p className={styles.adText}>
      At the University of Michigan-Dearborn, we believe in investing in talent. 
      The Bright Scholarship is your opportunity to get the financial support you need 
      to focus on what matters most – your education and your dreams.  
    </p>
    <p className={styles.adText}>
      With competitive funding, recognition for academic excellence, and personalized support, 
      the Bright Scholarship could be the game-changer for your college journey. Don't miss the 
      chance to become part of a select group of students driving their success to new heights!
    </p>
    <div className={styles.centeredButton}>
      <Link to="/apply" className={styles.applyButton}>Apply Now</Link>
    </div>
  </div>
);

export default Home;
