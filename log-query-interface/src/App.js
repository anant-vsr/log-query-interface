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

// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogForm from './components/LogForm';
import LoginPage from './components/LoginPage'; // Import the LoginPage component
import './App.css';
import Register from './components/Register'; // Adjust the path as needed


function App() {
  const initialQueryParams = {
    level: '',
    message: '',
    resourceId: '',
    startDate: '',
    endDate: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
  };

  const [logs, setLogs] = useState([]);
  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const [token, setToken] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
  // Check if there's a token in local storage
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    setToken(storedToken);
  }

  // Fetch logs when the component mounts
  if (token) {
    fetchLogs();
  }
}, [token]);

// Include queryParams and token as dependencies to refetch when they change

  const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const fetchLogs = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logs', {
      params: queryParams,
      ...axiosConfig,
    });

    const fetchedLogs = response.data;

    if (fetchedLogs.length === 0) {
      setError('No logs found matching the specified criteria.');
    } else {
      setError(null); // Clear previous error messages
    }

    setLogs(fetchedLogs);
  } catch (error) {
    console.error(error);
    setError('Error fetching logs. Please try again.'); // Set error message
  }
};



const fetchLogsByTraceId = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsByTraceId', {
      params: queryParams,
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchLogsBySpanId = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsBySpanId', {
      params: queryParams,
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchLogsByCommit = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsByCommit', {
      params: queryParams,
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchLogsByParentResourceId = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsByParentResourceId', {
      params: queryParams,
      ...axiosConfig,
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
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchLogsByMessage = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsByMessage', {
       params: queryParams,
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchLogsByResourceId = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsByResourceId', {
      params: queryParams,
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};

const fetchLogsByTimestampRange = async () => {
  try {
    const response = await axios.get('http://localhost:5000/logsByTimestampRange', {
     params: queryParams,
      ...axiosConfig,
    });
    setLogs(response.data);
  } catch (error) {
    console.error(error);
  }
};


  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setToken(token);
  };
  const handleLogout = () => {
  // Remove the token from local storage
  localStorage.removeItem('authToken');
  setToken('');
};


  const handleLogInsert = () => {
    // Trigger a log fetch when a new log is inserted
    fetchLogs();
  };

  const handleSearch = () => {
    // Trigger a log fetch when the search button is clicked
     fetchLogs();
    setQueryParams(initialQueryParams); // Reset search form fields
  };
  const handleSearchtimestamp = () => {
    // Trigger a log fetch when the search button is clicked
     fetchLogsByTimestampRange ();
    setQueryParams(initialQueryParams); // Reset search form fields
  };



  return (
    <div>
      
     {!token ? (
  <>
    {!showLogin ? (
      <button onClick={() => setShowLogin(true)}>Switch to Login</button>
    ) : (
      <button onClick={() => setShowLogin(false)}>Switch to Register</button>
    )}

    {showLogin ? (
      <LoginPage onLogin={handleLogin} />
    ) : (
      <Register onRegister={() => setShowLogin(true)} />
    )}
  </>
) : (
        <>
          <h1>Log Query Interface</h1>

          <p>Welcome! You are logged in.</p>
          {/* {setError && <p className="error-message">{setError}</p>} */}
          <button onClick={handleLogout}>Logout</button>

          {/* Log insertion form */}
          <LogForm token={token} onLogInsert={handleLogInsert} setError={setError}/>
          {/* {setError && <p className="error-message">{setError}</p>} */}
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
           <button onClick={handleSearchtimestamp}>Search by Timestamp Range</button>
          {/* <button onClick={fetchLogsByMessage}>Search by Message</button>
          <button onClick={fetchLogsByResourceId}>Search by Resource ID</button>
          <button onClick={fetchLogsByTraceId}>Search by Trace ID</button>
          <button onClick={fetchLogsBySpanId}>Search by Span ID</button>
          <button onClick={fetchLogsByCommit}>Search by Commit</button>
          <button onClick={fetchLogsByParentResourceId}>Search by Parent Resource ID</button> */}

          {error && <p className="error-message">{error}</p>}

          <ul>
            {logs.map((log) => (
              <li key={log._id}>
                <strong>{log.level}:</strong> {log.message} -{' '}
                {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
