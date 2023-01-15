import Container from 'react-bootstrap/esm/Container'
import Nav from 'react-bootstrap/esm/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { loginRequest } from '../../authConfig'
import { callMsGraph } from '../../utilities/api/graph'

function handleLogin(instance: any) {
  instance.loginPopup(loginRequest).catch(console.error)
}

function handleLogout(instance: any) {
  instance.logoutRedirect().catch(console.error)
}

function SWSPHeader() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const requestCaregivers = () => {
    const graphRequest = {
      scopes: ['User.Read'],
      account: accounts[0],
    }

    instance
      .acquireTokenSilent(graphRequest)
      .then((response: any) => {
        callMsGraph(response.accessToken).then((response: any) => {
          console.log(response)
        })
      })
      .catch(() => {
        instance.acquireTokenPopup(graphRequest).then((response: any) => {
          callMsGraph(response.accessToken).then((response: any) => {
            console.log(response)
          })
        })
      })
  }

  return (
    <Navbar bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">SWSP Admin Dashboard</Navbar.Brand>
        <Nav>
          {isAuthenticated ? (
            <>
              <Nav.Link
                className="justify-content-end"
                onClick={() => requestCaregivers()}
              >
                {accounts[0] && accounts[0].name}
              </Nav.Link>
              <Nav.Link
                className="justify-content-end"
                onClick={() => handleLogout(instance)}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <Nav.Link
              className="justify-content-end"
              onClick={() => handleLogin(instance)}
            >
              Login
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default SWSPHeader
