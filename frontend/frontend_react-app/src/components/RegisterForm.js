// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/UseAuth';

function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [picture, setPicture] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      picture,
    };
    await register(newUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        Phone:
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label>
        Picture:
        <input
          type="text"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
