// src/components/ApplicantForm.js
import axios from 'axios';
import React, { useState } from 'react';


const ApplicantForm = () => {
  const [formData, setFormData] = useState({
    student_number: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    email_address: '',
    gender: 'Male',
    date_of_birth: '',
    status: 'Freshman',
    cumulative_gpa: '',
    credit_hours: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/applicants/submit', formData);
      setMessage(res.data.message);
      setFormData({
        student_number: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        email_address: '',
        gender: 'Male',
        date_of_birth: '',
        status: 'Freshman',
        cumulative_gpa: '',
        credit_hours: '',
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting application.');
    }
  };

  return (
    <div>
      <h2>Apply for Bright Scholarship</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Input fields */}
        <input
          type="text"
          name="student_number"
          placeholder="Student Number"
          value={formData.student_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email_address"
          placeholder="Email Address"
          value={formData.email_address}
          onChange={handleChange}
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
        <input
          type="number"
          name="cumulative_gpa"
          placeholder="Cumulative GPA"
          step="0.01"
          value={formData.cumulative_gpa}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="credit_hours"
          placeholder="Credit Hours"
          value={formData.credit_hours}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplicantForm;
