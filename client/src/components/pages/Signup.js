// // src/components/auth/Signup.js
// import React, { useState } from "react";
// import axios from "axios";
// import { Container, Form, Button, Alert } from "react-bootstrap";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [surname, setSurname] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5000/api/users/register", {
//         name,
//         surname,
//         username,
//         email,
//         password,
//       });

//       // Show success message
//       setSuccessMessage("Account successfully created! Redirecting to login...");

//       // Clear error message if any
//       setErrorMessage("");

//       // Redirect to the login page after 3 seconds
//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 3000);
//     } catch (error) {
//       // Handle signup error and display error message
//       if (error.response && error.response.data && error.response.data.error) {
//         console.log(error);
//         setErrorMessage(error.response.data.error);
//       } else {
//         console.log(error);
//         setErrorMessage("An error occurred during signup. Please try again later.");
//       }
//     }
//   };

//   return (
//     <Container>
//       <h2>Signup</h2>
//       {successMessage && <Alert variant="success">{successMessage}</Alert>}
//       <Form onSubmit={handleSignup}>
//         <Form.Group controlId="name">
//           <Form.Label>Name:</Form.Label>
//           <Form.Control
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="surname">
//           <Form.Label>Surname:</Form.Label>
//           <Form.Control
//             type="text"
//             value={surname}
//             onChange={(e) => setSurname(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="username">
//           <Form.Label>Username:</Form.Label>
//           <Form.Control
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group controlId="email">
//           <Form.Label>Email:</Form.Label>
//           <Form.Control
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
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
//         <Button type="submit">Signup</Button>
//       </Form>
//     </Container>
//   );
// };

// export default Signup;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5000/api/users");
        const users = usersResponse.data;
        setExistingEmails(users.map((user) => user.email.toLowerCase()));
        setExistingUsernames(users.map((user) => user.username.toLowerCase()));

        const rolesResponse = await axios.get("http://localhost:5000/api/roles");
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate the form data and show errors if any
    const newErrors = {};

    // Check if all fields are filled
    if (name.trim() === "" || surname.trim() === "" || username.trim() === "" || email.trim() === "" || password.trim() === "") {
      newErrors.allFields = "Please fill in all the fields.";
    }

    const nameSurnameRegex = /^[A-Z][A-Za-z]{2,}$/;
    if (!nameSurnameRegex.test(name)) {
      newErrors.name =
        "Name should be at least 3 characters long and start with a capital letter and contain only alphabetic characters.";
    }
    if (!nameSurnameRegex.test(surname)) {
      newErrors.surname =
        "Surname should be at least 3 characters long and start with a capital letter and contain only alphabetic characters.";
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (existingEmails.includes(email.toLowerCase())) {
      newErrors.email = "This email address already exists in the database.";
    }

    if (username.trim() === "" || username === "1234") {
      newErrors.username =
        "Username should contain at least one letter, be at least 3 characters long.";
    } else if (existingUsernames.includes(username.toLowerCase())) {
      newErrors.username = "This username already exists in the database.";
    }

    setErrorMessage("");
    setSuccessMessage("");
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const adminRole = roles.find((role) => role.name.toLowerCase() === "admin");

      if (!adminRole) {
        setErrors({
          adminRole: "The 'admin' role does not exist in the database.",
        });
        return;
      }

      const roleData = {
        _id: adminRole._id,
      };

      const userData = {
        name,
        surname,
        username,
        email,
        password,
        role: roleData,
      };

      // Send the user data to the backend for signup
      const response = await axios.post("http://localhost:5000/api/users/register", userData);

      // Show success message
      setSuccessMessage("Account successfully created! Redirecting to login...");

      // Clear error message if any
      setErrorMessage("");

      // Redirect to the login page after 3 seconds
      setTimeout(() => {
        history.push("/login");
      }, 3000);
    } catch (error) {
      // Handle signup error and display error message
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error);
        setErrorMessage(error.response.data.error);
      } else {
        console.log(error);
        setErrorMessage("An error occurred during signup. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <h2>Signup</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSignup}>
        <Form.Group controlId="name">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </Form.Group>
        <Form.Group controlId="surname">
          <Form.Label>Surname:</Form.Label>
          <Form.Control
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          {errors.surname && <div className="text-danger">{errors.surname}</div>}
        </Form.Group>
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.allFields && <div className="text-danger">{errors.allFields}</div>}
        </Form.Group>
        <Button type="submit">Signup</Button>
      </Form>
    </Container>
  );
};

export default Signup;



