/* src/components/Navbar.js */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLabel}>University of Michigan-Dearborn</div>
      <ul className={styles.navList}>
        <li>
          <Link to="/" className={styles.navLink}>Home</Link>
        </li>
        <li>
          <Link to="/apply" className={styles.navLink}>Apply</Link>
        </li>
        <li>
          <Link to="/admin" className={styles.navLink}>Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

