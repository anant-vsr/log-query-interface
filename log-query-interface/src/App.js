// // src/App.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import LogForm from './components/LogForm'; // Adjust the path based on your project structure

// function App() {
//   const [logs, setLogs] = useState([]);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     // Fetch logs when the component mounts
//     fetchLogs();
//   }, []);

//   const fetchLogs = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/logs', {
//         params: { q: query }
//       });
//       setLogs(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleLogInsert = () => {
//     // Trigger a log fetch when a new log is inserted
//     fetchLogs();
//   };

//   return (
//     <div>
//       <h1>Log Query Interface</h1>

//       {/* Log insertion form */}
//       <LogForm onLogInsert={handleLogInsert} />

//       <input
//         type="text"
//         placeholder="Search logs"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       <button onClick={fetchLogs}>Search</button>

//       <ul>
//         {logs.map((log) => (
//           <li key={log._id}>
//             <strong>{log.level}:</strong> {log.message} - {new Date(log.timestamp).toLocaleString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


/////NEW CODE



///search functionality code

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import LogForm from './components/LogForm';

// function App() {
//   const [logs, setLogs] = useState([]);
//   const [queryParams, setQueryParams] = useState({
//     level: '',
//     message: '',
//     resourceId: '',
//     startDate: '',
//     endDate: '',
//   });

//   useEffect(() => {
//     // Fetch logs when the component mounts
//     fetchLogs();
//   }, []); // Empty dependency array to fetch logs only once when the component mounts

//   const fetchLogs = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/logs', {
//         params: queryParams
//       });
//       setLogs(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchLogsByResourceId = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/logsByResourceId', {
//         params: { resourceId: queryParams.resourceId }
//       });
//       setLogs(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchLogsByMessage = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/logsByMessage', {
//         params: { message: queryParams.message }
//       });
//       setLogs(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleLogInsert = () => {
//     // Trigger a log fetch when a new log is inserted
//     fetchLogs();
//   };

//   const handleSearch = () => {
//     // Trigger a log fetch when the search button is clicked
//     fetchLogs();
//   };

//   const handleSearchByResourceId = () => {
//     // Trigger a log fetch by resourceId when the corresponding search button is clicked
//     fetchLogsByResourceId();
//   };

//   const handleSearchByMessage = () => {
//     // Trigger a log fetch by message when the corresponding search button is clicked
//     fetchLogsByMessage();
//   };

//   return (
//     <div>
//       <h1>Log Query Interface</h1>

//       {/* Log insertion form */}
//       <LogForm onLogInsert={handleLogInsert} />

//       {/* Input fields for search parameters */}
//       <label>
//         Level:
//         <input
//           type="text"
//           value={queryParams.level}
//           onChange={(e) => setQueryParams({ ...queryParams, level: e.target.value })}
//         />
//       </label>

//       <label>
//         Message:
//         <input
//           type="text"
//           value={queryParams.message}
//           onChange={(e) => setQueryParams({ ...queryParams, message: e.target.value })}
//         />
//       </label>

//       <label>
//         Resource ID:
//         <input
//           type="text"
//           value={queryParams.resourceId}
//           onChange={(e) => setQueryParams({ ...queryParams, resourceId: e.target.value })}
//         />
//       </label>

//       {/* Other input fields for search parameters */}

//       {/* Buttons to trigger search */}
//       <button onClick={handleSearch}>Search</button>
//       <button onClick={handleSearchByResourceId}>Search by Resource ID</button>
//       <button onClick={handleSearchByMessage}>Search by Message</button>

//       <ul>
//         {logs.map((log) => (
//           <li key={log._id}>
//             <strong>{log.level}:</strong> {log.message} -{' '}
//             {new Date(log.timestamp).toLocaleString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


// src/App.js

// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogForm from './components/LogForm';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [queryParams, setQueryParams] = useState({
    level: '',
    message: '',
    resourceId: '',
    startDate: '',
    endDate: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
  });

  useEffect(() => {
    // Fetch logs when the component mounts
    fetchLogs();
  }, [queryParams]); // Include queryParams as a dependency to refetch when it changes

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logs', {
        params: queryParams,
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByTraceId = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByTraceId', {
        params: { traceId: queryParams.traceId },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsBySpanId = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsBySpanId', {
        params: { spanId: queryParams.spanId },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByCommit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByCommit', {
        params: { commit: queryParams.commit },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByParentResourceId = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByParentResourceId', {
        params: { parentResourceId: queryParams.parentResourceId },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByLevel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByLevel', {
        params: { level: queryParams.level },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByMessage = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByMessage', {
        params: { message: queryParams.message },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByResourceId = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByResourceId', {
        params: { resourceId: queryParams.resourceId },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLogsByTimestampRange = async () => {
    try {
      const response = await axios.get('http://localhost:5000/logsByTimestampRange', {
        params: { startDate: queryParams.startDate, endDate: queryParams.endDate },
      });
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogInsert = () => {
    // Trigger a log fetch when a new log is inserted
    fetchLogs();
  };

  const handleSearch = () => {
    // Trigger a log fetch when the search button is clicked
    fetchLogs();
  };

  return (
    <div>
      <h1>Log Query Interface</h1>

      {/* Log insertion form */}
      <LogForm onLogInsert={handleLogInsert} />

      {/* Input fields for search parameters */}
      <label>
        Level:
        <input
          type="text"
          value={queryParams.level}
          onChange={(e) => setQueryParams({ ...queryParams, level: e.target.value })}
        />
      </label>

      <label>
        Message:
        <input
          type="text"
          value={queryParams.message}
          onChange={(e) => setQueryParams({ ...queryParams, message: e.target.value })}
        />
      </label>

      <label>
        Resource ID:
        <input
          type="text"
          value={queryParams.resourceId}
          onChange={(e) => setQueryParams({ ...queryParams, resourceId: e.target.value })}
        />
      </label>

      <label>
        Start Date:
        <input
          type="text"
          placeholder="YYYY-MM-DDTHH:mm:ssZ"
          value={queryParams.startDate}
          onChange={(e) => setQueryParams({ ...queryParams, startDate: e.target.value })}
        />
      </label>

      <label>
        End Date:
        <input
          type="text"
          placeholder="YYYY-MM-DDTHH:mm:ssZ"
          value={queryParams.endDate}
          onChange={(e) => setQueryParams({ ...queryParams, endDate: e.target.value })}
        />
      </label>

      <label>
        Trace ID:
        <input
          type="text"
          value={queryParams.traceId}
          onChange={(e) => setQueryParams({ ...queryParams, traceId: e.target.value })}
        />
      </label>

      <label>
        Span ID:
        <input
          type="text"
          value={queryParams.spanId}
          onChange={(e) => setQueryParams({ ...queryParams, spanId: e.target.value })}
        />
      </label>

      <label>
        Commit:
        <input
          type="text"
          value={queryParams.commit}
          onChange={(e) => setQueryParams({ ...queryParams, commit: e.target.value })}
        />
      </label>

      <label>
        Parent Resource ID:
        <input
          type="text"
          value={queryParams.parentResourceId}
          onChange={(e) => setQueryParams({ ...queryParams, parentResourceId: e.target.value })}
        />
      </label>

      {/* Buttons to trigger search */}
      <button onClick={handleSearch}>Search</button>
      <button onClick={fetchLogsByLevel}>Search by Level</button>
      <button onClick={fetchLogsByMessage}>Search by Message</button>
      <button onClick={fetchLogsByResourceId}>Search by Resource ID</button>
      <button onClick={fetchLogsByTimestampRange}>Search by Timestamp Range</button>
      <button onClick={fetchLogsByTraceId}>Search by Trace ID</button>
      <button onClick={fetchLogsBySpanId}>Search by Span ID</button>
      <button onClick={fetchLogsByCommit}>Search by Commit</button>
      <button onClick={fetchLogsByParentResourceId}>Search by Parent Resource ID</button>
     
      
     
      

      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            <strong>{log.level}:</strong> {log.message} -{' '}
            {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
