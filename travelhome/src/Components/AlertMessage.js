import React, { useState, useEffect } from 'react';

const Alert = ({error, message}) => {
  const [showError, setShowError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');

  useEffect(()=>{
    if(error && message){
      setShowError(error);
      setErrorMessage(message);
    }

  },[error,message])

  useEffect(() => {
    let timeout;
    if (showError) {
      handleShowError();
      timeout = setTimeout(() => {
        hideError();
      }, 2500);
    }
  }, [showError]);


  const handleShowError = () => {
    setShowError(true);
    let warning = document.getElementById("warning");
    warning.animate(
      [
        {transform: 'scale(0)'},
        {transform: 'scale(1)', opacity: 1},
      ],
      {
        duration: 150,
        easing: 'ease-in',
        fill: 'forwards'
      }
    )
  };

  const hideError = () => {
  
    let warning = document.getElementById("warning");
    warning.animate(
      [
        {opacity: 1},
        {opacity: 0},
      ],
      {
        duration: 150,
        easing: 'ease-in',
        fill: 'forwards'
      }
    ).onfinish = () =>{setShowError(false)}
  };



  return (
    <>
      <div id='warning' className='flex justify-center z-50'>
        {showError &&
          <><div id='warning' className={`alert alert-error w-max justify-center`} role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-medium">Hiba!</span> {message}
          </div></>
        }
      </div>
    </>
  );
};

export default Alert;
