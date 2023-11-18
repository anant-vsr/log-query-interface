// Register.js

import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        role,
      });

      console.log(response.data);
      // Assuming the server responds with a success message
      // You may want to handle the response according to your server implementation

      // Optionally, you can automatically log in the user after successful registration
      // This is just for demonstration; you may want to handle it differently based on your requirements
      if (response.status === 201) {
        onRegister();
      }
    } catch (error) {
      console.error(error);
      // Handle registration error, e.g., display an error message to the user
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Role:
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
      </label>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
