// src/components/auth/Login.js
import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });

      // Save the access token in local storage
      localStorage.setItem("accessToken", response.data.token);

      // Clear error message if any
      setErrorMessage("");

      // Redirect to the home page after successful login
      window.location.href = "/";
    } catch (error) {
      // Handle login error and display error message
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error);
        setErrorMessage(error.response.data.error);
      } else {
        console.log(error);
        setErrorMessage("An error occurred during login. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;
