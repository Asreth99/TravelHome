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
    <div className="navbar bg-base-300 fixed shadow-xl z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href='/'>TravelHome</a>
      </div>

      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button">
          <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
          </button>
        </div>

        <ul tabIndex={0} className="mt-3 z-60 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">

          {userLoggedIn ? (
            <>
              <li>
                <a className="justify-between" href='/savedProperties'>
                  Mentett ingatlanok
                </a>
              </li>

              <li>
                <button onClick={doSignOut}>Kijelentkezés</button>
              </li></>
          ) : (
            <li>
              <a href='/login'>Belépés</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NavigationBar;