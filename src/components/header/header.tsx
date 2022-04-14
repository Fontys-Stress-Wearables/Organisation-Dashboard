import Container from 'react-bootstrap/esm/Container';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/Navbar'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { useIsAuthenticated } from "@azure/msal-react";

function handleLogin(instance: any) {
  instance.loginPopup(loginRequest).catch(
    console.error
  );
}

function handleLogout(instance: any) {
  instance.logoutRedirect().catch(
    console.error
  );
}

const Header = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="#home">SWSP Organisation Management</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="home">Home</Nav.Link>
          <Nav.Link href="patients">Patients</Nav.Link>
          <Nav.Link href="caregivers">Caregivers</Nav.Link>
          <Nav.Link href="patient-groups">Patient-groups</Nav.Link>
        </Nav>
        <Nav>
          {
            isAuthenticated ?
              <Nav.Link className="justify-content-end" onClick={() => handleLogout(instance)} >{accounts[0] && accounts[0].name}, Logout</Nav.Link>
              :
              <Nav.Link className="justify-content-end" onClick={() => handleLogin(instance)} >Login</Nav.Link>
          }
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header