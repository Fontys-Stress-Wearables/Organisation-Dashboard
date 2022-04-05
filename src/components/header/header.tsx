import Container from 'react-bootstrap/esm/Container';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/Navbar'

const Header = () => {
// expand={false} 
  return(
    <Navbar bg="primary" variant="dark">
    <Container>
    <Navbar.Brand href="#home">SWSP Organisation Management</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#patients">Patients</Nav.Link>
      <Nav.Link href="#caregivers">Caregivers</Nav.Link>
      <Nav.Link href="#patient-groups">Patient-groups</Nav.Link>
    </Nav>
    <Nav>
      <Nav.Link className="justify-content-end" href="#logout">Logout</Nav.Link>
    </Nav>
    </Container>
  </Navbar>
  ); 
}

export default Header