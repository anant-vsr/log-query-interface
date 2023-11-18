// Import necessary dependencies
import React, { useState } from 'react';
import axios from 'axios';

// LoginPage component
function LoginPage({ onLogin }) {
  // State for handling form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    try {
      // Make a POST request to the login endpoint
      const response = await axios.post('http://localhost:5000/login', {
        username, // Fix: Use the 'username' state variable
        password, // Fix: Use the 'password' state variable
      });

      // Extract the token from the response data
      const { token } = response.data;

      // Call the onLogin function passed as a prop with the token
      onLogin(token);
    } catch (error) {
      console.error(error);
      // Set an error message in case of login failure
      setError('Invalid username or password');
    }
  };

  // Your JSX code for the login form
  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>

      {/* Display an error message if login fails */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default LoginPage;
