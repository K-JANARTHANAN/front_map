import React from 'react';
import { useNavigate } from 'react-router-dom';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function Home() {
  const navigate = useNavigate();

  const handleMonthClick = (month) => {
    navigate(`/month/${month}`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Select a Month</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '500px', margin: 'auto' }}>
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthClick(month)}
            style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
