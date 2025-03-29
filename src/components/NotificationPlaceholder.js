import React, { useState } from 'react';

const NotificationPlaceholder = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is just a placeholder. In the future, you can implement email notifications.
    setSubmitted(true);
  };

  return (
    <div className="notification-placeholder">
      <h2>Email Notification (Coming Soon)</h2>
      <p>
        Enter your email to receive an end-of-day portfolio report. (Feature is not implemented yet.)
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {submitted && <p>Thank you! This feature will be available soon.</p>}
    </div>
  );
};

export default NotificationPlaceholder;
