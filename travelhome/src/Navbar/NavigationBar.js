import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../Services/Contexts/authContext/index.js"
import { doSignOut } from '../Services/Contexts/firebase/auth.js'
import { NavLink } from 'react-bootstrap';



const NavigationBar = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth();

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">TravelHome</Navbar.Brand>
                <Nav className="ms-auto">
                    {
                        userLoggedIn
                            ?

                            <>
                                <NavLink onClick={() => { doSignOut().then(() => { navigate('/login'); }); }}>Kijelentkezés</NavLink>

                                <Nav.Link href='/savedProperties'>Mentett Ingatlanok</Nav.Link>
                            </>
                            :
                            <Nav.Link href='/login'>Belépés</Nav.Link>
                    }


                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;