// import React, { useState } from "react";
// import axios from "axios";
// import { Container, Form, Button, Alert } from "react-bootstrap";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5000/api/users/login", {
//         username,
//         password,
//       });
//       localStorage.setItem("accessToken", response.data.token);
//       setErrorMessage("");
//       window.location.href = "/";
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         console.log(error);
//         setErrorMessage(error.response.data.error);
//       } else {
//         console.log(error);
//         setErrorMessage("An error occurred during login. Please try again later.");
//       }
//     }
//   };

//   return (
//     <Container>
//       <h2>Login</h2>
//       <Form onSubmit={handleLogin}>
//         <Form.Group controlId="username">
//           <Form.Label>Username:</Form.Label>
//           <Form.Control
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="password">
//           <Form.Label>Password:</Form.Label>
//           <Form.Control
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>
//         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//         <Button type="submit">Login</Button>
//       </Form>
//     </Container>
//   );
// };

// export default Login;




import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

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
      //stores the received token in the storage 
      localStorage.setItem("accessToken", response.data.token);
      setErrorMessage("");
      window.location.href = "/";
    } catch (error) {
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
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: "400px", padding: "20px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <h2 className="text-center">Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="username">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ height: "50px" }}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ height: "50px" }}
            />
          </Form.Group>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Button type="submit" className="w-100 mt-3">Login</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
