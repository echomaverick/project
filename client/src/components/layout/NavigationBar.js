// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

// function CollapsibleExample() {
//   return (
//     <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" sticky='top'>
//       <Container>
//         <Navbar.Brand href="/">Proventus Nexus</Navbar.Brand>
//         <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav className="me-auto">
            // <Nav.Link href="/">Home</Nav.Link>
            // <Nav.Link href="/about">About</Nav.Link>
            // <NavDropdown title="Menu" id="collasible-nav-dropdown">
            //   <NavDropdown.Item href="/users">Users</NavDropdown.Item>
            //   <NavDropdown.Item href="/tasks">
            //     Tasks
            //   </NavDropdown.Item>
            //   <NavDropdown.Item href="/projects">Projects</NavDropdown.Item>
              
            // </NavDropdown>
//           </Nav>
//           <Nav>
//             <Nav.Link href="/login">Login</Nav.Link>
//             <Nav.Link eventKey={2} href="/signup">
//               Sign up
//             </Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default CollapsibleExample;



// NavigationBar.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavigationBar({ isLoggedIn, username, handleLogout }) {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" sticky='top'>
      <Container>
        <Navbar.Brand href="/">Proventus Nexus</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            <NavDropdown title="Menu" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/users">Users</NavDropdown.Item>
              <NavDropdown.Item href="/tasks">
                Tasks
              </NavDropdown.Item>
              <NavDropdown.Item href="/projects">Projects</NavDropdown.Item>
              
            </NavDropdown>
          </Nav>
          {isLoggedIn ? (
            <Nav>
              <Navbar.Text>Welcome, {username}</Navbar.Text>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              {/* If not logged in, display Login and Sign up links */}
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link eventKey={2} href="/signup">
                Sign up
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
