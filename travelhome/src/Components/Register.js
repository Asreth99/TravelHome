import { Form, Button } from "react-bootstrap";
import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Services/Contexts/authContext/index'
import { doCreateUserWithEmailAndPassword } from '../Services/Contexts/firebase/auth';
import { getAuth, updateProfile } from "firebase/auth";
const Register = () => {

    const { userLoggedIn , updateDisplayName } = useAuth()




    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const[name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        await doCreateUserWithEmailAndPassword(email, password);
        await updateDisplayName(name);
     

       

    };

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Felhasználónév</Form.Label>
                    <Form.Control type='text' required value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control type="password" required value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Jelszó Megerősítés</Form.Label>
                    <Form.Control type="password" required value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} />
                </Form.Group>

                <Button type="submit">Regisztráció</Button>
            </Form>

        </div>
    );

}

export default Register;