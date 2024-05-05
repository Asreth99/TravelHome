import { Form, Button } from "react-bootstrap";
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
        console.log(email);
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInUserWithEmailAndPassword(email, password);
            // doSendEmailVerification()
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Bejelentkezés!</h1>
                        <p className="py-6">Jelentkezz be, hogy el tudd menteni kereséseid.</p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={onSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text" >Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" required onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password </span>
                                </label>
                                <input type="password" placeholder="password" className="input input-bordered" required onChange={(e) => setPassword(e.target.value)}/>
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary" type="submit">Bejelentkezés</button>
                                <div className="flex flex-col w-full">
                                    <div className="divider">Vagy</div>
                                </div>
                                <label className="label">
                                    <a href="/register" className="label-text-alt link link-hover ml-auto mr-auto">Hozz létre fiókot</a>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div></>

    );
}

export default Login;
