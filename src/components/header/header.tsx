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

  const requestToken = () => {
    const request = {
      scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
      account: accounts[0]
    };

    instance.acquireTokenSilent(request).then((response: any) => {
      console.log(response.accessToken);
    }).catch((e: any) => {
      console.log(e)
      instance.acquireTokenPopup(request).then((response: any) => {
        console.log(response.accessToken);
      });
    });
  }

  return (
    <Navbar bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">SWSP Organization Management</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="home">Home</Nav.Link>
          <Nav.Link href="patients">Patients</Nav.Link>
          <Nav.Link href="caregivers">Caregivers</Nav.Link>
          <Nav.Link href="patient-groups">Patient-groups</Nav.Link>
        </Nav>
        <Nav>
          {
            isAuthenticated ?
              <>
                <Nav.Link className="justify-content-end" onClick={() => requestToken()} >{accounts[0] && accounts[0].name}</Nav.Link>
                <Nav.Link className="justify-content-end" onClick={() => handleLogout(instance)} >Logout</Nav.Link>
              </>
              :
              <Nav.Link className="justify-content-end" onClick={() => handleLogin(instance)} >Login</Nav.Link>
          }
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header