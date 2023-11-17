import React, { useState } from 'react';
import axios from 'axios';

const LogForm = ({ onLogInsert }) => {
  const [logData, setLogData] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestamp: '',
    traceId: '',
    spanId: '',
    commit: '',
    metadata: {
      parentResourceId: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the property is nested (like metadata), handle it separately
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLogData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value
        }
      }));
    } else {
      setLogData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/ingest', logData);
      console.log('Log inserted successfully');
      // Notify the parent component that a log has been inserted
      onLogInsert();
    } catch (error) {
      console.error('Error inserting log:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Level:
        <input type="text" name="level" value={logData.level} onChange={handleChange} />
      </label>

      <label>
        Message:
        <input type="text" name="message" value={logData.message} onChange={handleChange} />
      </label>

      <label>
        Resource ID:
        <input type="text" name="resourceId" value={logData.resourceId} onChange={handleChange} />
      </label>

      <label>
        Timestamp:
        <input type="text" name="timestamp" value={logData.timestamp} onChange={handleChange} />
      </label>

      <label>
        Trace ID:
        <input type="text" name="traceId" value={logData.traceId} onChange={handleChange} />
      </label>

      <label>
        Span ID:
        <input type="text" name="spanId" value={logData.spanId} onChange={handleChange} />
      </label>

      <label>
        Commit:
        <input type="text" name="commit" value={logData.commit} onChange={handleChange} />
      </label>

      <label>
        Parent Resource ID:
        <input type="text" name="metadata.parentResourceId" value={logData.metadata.parentResourceId} onChange={handleChange} />
      </label>

      {/* Add more input fields for other log properties */}

      <button type="submit">Insert Log</button>
    </form>
  );
};

export default LogForm;
