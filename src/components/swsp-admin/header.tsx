import Container from 'react-bootstrap/esm/Container';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/Navbar'
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { useIsAuthenticated } from "@azure/msal-react";
import { callMsGraph } from "../../utilities/api/graph";
import { AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";

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

const SWSPHeader = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const requestToken = () => {
    const request = {
      scopes: [AUTH_REQUEST_SCOPE_URL, "User.Read"],
      account: accounts[0],
    };

    instance.acquireTokenSilent(request).then((response: any) => {
      console.log(response.accessToken);
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((response: any) => {
        console.log(response.accessToken);
      });
    });
  }

  const requestCaregivers = () => {
    const graphRequest = {
      scopes: ["User.Read"],
      account: accounts[0],
    }

    instance.acquireTokenSilent(graphRequest).then((response: any) => {
      callMsGraph(response.accessToken).then((response: any) => {
        console.log(response)
      })
    }).catch((e: any) => {
      instance.acquireTokenPopup(graphRequest).then((response: any) => {
        callMsGraph(response.accessToken).then((response: any) => {
          console.log(response)
        })
      });
    });
  }

  return (
    <Navbar bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">SWSP Admin Dashboard</Navbar.Brand>
        <Nav>
          {
            isAuthenticated ?
              <>
                <Nav.Link className="justify-content-end" onClick={() => requestCaregivers()} >{accounts[0] && accounts[0].name}</Nav.Link>
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

export default SWSPHeader