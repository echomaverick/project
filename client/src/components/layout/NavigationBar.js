import React, { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom"; // Import useHistory
import { AuthContext } from "../layout/Auth";

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory(); // Get the history object

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    history.push("/"); // Redirect to the home screen after logging out
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Navbar.Brand href="/">Proventus Nexus</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/user/add">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav className="ms-auto">
              <NavDropdown title={`Welcome, ${user.username}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/projects">
                  Projects
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/tasks">
                  Tasks
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item> {/* Use handleLogout */}
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
