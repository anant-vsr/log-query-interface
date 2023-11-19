import React, { useState } from 'react';
import axios from 'axios';

const LogForm = ({ onLogInsert, token, setError }) => {
  const initialLogData = {
    level: '',
    message: '',
    resourceId: '',
    timestamp: '',
    traceId: '',
    spanId: '',
    commit: '',
    metadata: {
      parentResourceId: '',
    },
  };

  const [logData, setLogData] = useState(initialLogData);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    console.log('Setting nested field:', parent, child, value);
    setLogData((prevData) => ({
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [child]: value,
      },
    }));
  } else {
    console.log('Setting regular field:', name, value);
    setLogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('Log data to be submitted:', logData);

  // Check if any required fields are empty
  const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata.parentResourceId'];
const emptyFields = requiredFields.filter(field => {
  if (field === 'metadata.parentResourceId') {
    return !logData.metadata || !logData.metadata.parentResourceId;
  } else {
    return !logData[field];
  }
});

console.log('Empty fields:', emptyFields);

if (emptyFields.length > 0) {
  setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
  return;
}

  try {
    // Ensure that metadata is set correctly
    const dataToSend = {
      ...logData,
      metadata: {
        parentResourceId: logData.metadata.parentResourceId,
      },
    };

    console.log('Data to be sent:', dataToSend);

    await axios.post('http://localhost:5000/ingest', dataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Log inserted successfully');
    onLogInsert();
    setLogData(initialLogData); // Reset form data
    setError(null); // Clear error message
  } catch (error) {
    console.error('Error inserting log:', error.response.data);
    setError('Error inserting log. Please try again.'); // Set error message
    setLogData(initialLogData); // Reset form data even in case of failure
  }
};





  return (
    <div>
        {/* {setError && <p className="error-message">{setError}</p>} */}
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
        <input
          type="text"
          name="metadata.parentResourceId"
          value={logData.metadata.parentResourceId}
          onChange={handleChange}
        />
      </label>

      {/* Add more input fields for other log properties */}

      <button type="submit">Insert Log</button>
     
    </form>
    </div>

  );
};

export default LogForm;
