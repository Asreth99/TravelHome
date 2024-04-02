import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';



const NavigationBar = () => {
    return ( 
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">TravelHome</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link href='/login'>Belépés</Nav.Link>
                    <Nav.Link href='/savedProperties'>Mentett Ingatlanok</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
     );
}
 
export default NavigationBar;