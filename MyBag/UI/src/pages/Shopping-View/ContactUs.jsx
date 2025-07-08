import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function isFormValid() {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.subject.trim() !== '' &&
      formData.message.trim() !== ''
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Real API call to submit query to backend
      const response = await fetch('https://mybag-server-mern.onrender.com/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit query');
      }

      toast.success('Your query has been submitted successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit your query. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mt-4">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} noValidate>
        <table className='table table-striped table-hover'>
        <tr className="mb-3 table-hover">
          <th><label htmlFor="name" className="form-label">Name</label></th>
          <td><input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          /></td>
        </tr>
        <tr className="mb-3">
          <th><label htmlFor="email" className="form-label">Email</label></th>
          <td><input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          /></td>
        </tr>
        <tr className="mb-3">
          <th><label htmlFor="subject" className="form-label">Subject</label></th>
          <td><input
            id="subject"
            name="subject"
            type="text"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          /></td>
        </tr>
        <tr className="mb-3">
          <th><label htmlFor="message" className="form-label">Message</label></th>
          <td><textarea
            id="message"
            name="message"
            className="form-control"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          /></td>
        </tr>
        <tr>
          <td>
        <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        </td>
        </tr>
        </table>
      </form>
      <ToastContainer position="top-right" className="p-3" />
    </div>
  );
}
