// src/pages/Admin.js
import React from 'react';
import ApplicantsList from '../components/ApplicantsList';
import AwardScholarship from '../components/AwardScholarship';

const Admin = () => (
  <div>
    <h2>Admin Panel</h2>
    <ApplicantsList />
    <AwardScholarship />
  </div>
);

export default Admin;
