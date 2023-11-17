const axios = require('axios');

const logData = {
  level: 'info',
  message: 'Application started',
  resourceId: 'server-1234',
  timestamp: '2023-09-15T08:00:00Z',
  traceId: 'abc-xyz-123',
  spanId: 'span-456',
  commit: '5e5342f',
  metadata: {
    parentResourceId: 'server-0987'
  }
};

axios.post('http://localhost:3000/ingest', logData)
  .then(response => {
    console.log('Log inserted successfully:', response.data);
  })
  .catch(error => {
    console.error('Error inserting log:', error.response.data);
  });
