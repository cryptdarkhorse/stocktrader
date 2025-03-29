import React, { useState } from 'react';

const BacktestingForm = ({ onUpload }) => {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        onUpload(csvData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="backtesting-form">
      <h2>Backtesting</h2>
      <p>
        Upload a CSV file containing historical stock data. The CSV file should be in the following format:
      </p>
      <pre>
Date,Open,High,Low,Close,Volume
2023-01-01,100.0,105.0,95.0,102.0,1500000
2023-01-02,102.0,108.0,101.0,107.0,1300000
...
      </pre>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {fileName && <p>Uploaded File: {fileName}</p>}
    </div>
  );
};

export default BacktestingForm;
