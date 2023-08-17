import React, { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../layout/Auth";

const NavigationBar = () => {
  const { user, logout, token, updateUser } = useContext(AuthContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [userTasks, setUserTasks] = useState([]);
  const [userProjects, setUserProjects] = useState([]);

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const handleUpdateProfile = async () => {
    try {
      const apiUrl = `http://localhost:5000/api/users/${user._id}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        updateUser(response.data);
        console.log("User data updated:", response.data);
        history.push({
          pathname: `/users/edit/${user._id}`,
          state: { userData: response.data },
        });
      } else {
        console.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const apiUrl = `http://localhost:5000/api/users/${user._id}`;
          const response = await axios.get(apiUrl);
          if (response.status === 200) {
            setLoading(false);
          } else {
            console.error("Failed to fetch user data.");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };

    const fetchUserTasks = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/tasks/user/${user.username}`
          );
          setUserTasks(response.data);
        } catch (error) {
          console.error("Error fetching user tasks:", error);
        }
      }
    };

    const fetchUserProjects = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/projects/user/${user.username}`
          );
          setUserProjects(response.data);
        } catch (error) {
          console.error("Error fetching user projects:", error);
        }
      }
    };

    fetchUserData();
    fetchUserTasks();
    fetchUserProjects();
  }, [user]);


  console.log("Rendering NavigationBar with user:", user);
  
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary"
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Proventus Nexus
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user && (
              <NavDropdown
                title={`Welcome, ${user.username}`}
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to={`/tasks/user/${user.username}`}>
                  Tasks
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to={`/projects/user/${user.username}`}
                >
                  Projects
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleUpdateProfile}>
                  Update your profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
