import React, { useState,useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../Services/Contexts/authContext/index'
import { doCreateUserWithEmailAndPassword } from '../Services/Contexts/firebase/auth';
import Alert from "./AlertMessage.js";

const Register = () => {

    const { userLoggedIn, updateDisplayName } = useAuth()

    const [showError, setShowError] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let timeout;
        if (showError) {
          timeout = setTimeout(() => {
            setShowError(false);
          }, 3000);
        }
      }, [showError]);



    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [name, setName] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("passw: "+password+" confirm passw: "+confirmPassword);
        if(password !== confirmPassword){
            setShowError(true);
            setErrorMessage("A beírt jelszavak nem egyeznek!");
            return;
        }

        try{
            await doCreateUserWithEmailAndPassword(email, password);
            await updateDisplayName(name);
        }catch(error){
            setShowError(true);
            setErrorMessage("Hiba a regisztráció során!");
        }
        




    };

    return (


        <>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            {showError &&
                <Alert error={showError} message={ErrorMessage}/>
            }
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Regisztráció!</h1>
                        <p className="py-6">Regisztrálj egy fiókot, hogy el tudd menteni kereséseid későbbre.</p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body" onSubmit={onSubmit}>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Felhasználónév</span>
                                </label>
                                <input type="text" placeholder="felhasználónév" className="input input-bordered" required onChange={(e) => { setName(e.target.value); }} />
                            </div>

                            <div className="form-control flex gap-2">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" required onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Jelszó </span>
                                </label>
                                <input type="password" placeholder="jelszó" className="input input-bordered" required onChange={(e) => { setPassword(e.target.value); }} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Jelszó megerősítése </span>
                                </label>
                                <input type="password" placeholder="jelszó" className="input input-bordered" required onChange={(e) => setconfirmPassword(e.target.value)} />

                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary" type="submit">Regisztráció</button>
                                <div className="flex flex-col w-full">
                                    <div className="divider">Vagy</div>
                                </div>
                                <label className="label">
                                    <a href="/login" className="label-text-alt link link-hover ml-auto mr-auto">Már van fiókod?</a>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div></>
    );

}

export default Register;