
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";
import { useAuth } from "../Services/Contexts/authContext/index.js"
import { doSignOut } from '../Services/Contexts/firebase/auth.js'
import Toast from '../Components/ToastMessage.js';



const NavigationBar = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth();

  const [showFeedback, setShowFeedback] = useState(false);
  const [FeedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (showFeedback) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }
  }, [showFeedback]);

  const handleLogout = () => {
    doSignOut();

    setShowFeedback(true);
    setFeedbackMessage('Sikeres kijelentkezés!')


  };
  return (

    <>



      <div className="flex navbar bg-base-300 fixed shadow-xl z-30">


        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href='/'>TravelHome</a>
        </div>


        {showFeedback &&
          <div className="toast-containe absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
            <Toast feedback={showFeedback} message={FeedbackMessage} />
          </div>

        }





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
                  <button onClick={handleLogout}>Kijelentkezés</button>
                </li></>
            ) : (
              <li>
                <a href='/login'>Belépés</a>
              </li>
            )}
          </ul>
        </div>
      </div></>
  );
}

export default NavigationBar;