import {Form, Button } from "react-bootstrap";
import { doSignInUserWithEmailAndPassword } from "../Services/Contexts/firebase/auth";
import { useAuth } from "../Services/Contexts/authContext/index.js"
import { useState } from "react";
import { Navigate } from 'react-router-dom'

const Login = () => {

    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInUserWithEmailAndPassword(email, password);
            // doSendEmailVerification()
        }
    }

    return (
        <div>
             {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <Form onSubmit={onSubmit}>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email Cím</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control type="Password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="warning" type="submit">Belépés</Button>
                <Button variant="warning" href="/register">Regisztráció</Button>
            </Form>
        </div>

    );
}

export default Login;
