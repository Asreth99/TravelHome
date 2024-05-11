import React, { useState, useEffect } from 'react';

const Toast = ({feedback, message }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [FeedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        if (feedback && message) {
            setShowFeedback(feedback);
            setFeedbackMessage(message);
        }

    }, [feedback, message])

    useEffect(() => {
        let timeout;
        if (showFeedback) {
            handleShowError();
            timeout = setTimeout(() => {
                hideError();
            }, 2500);
        }
    }, [showFeedback]);



    const handleShowError = () => {
        setShowFeedback(true);
        let warning = document.getElementById("toast");
        warning.animate(
            [
                { transform: 'scale(0)' },
                { transform: 'scale(1)', opacity: 1 },
            ],
            {
                duration: 150,
                easing: 'ease-in',
                fill: 'forwards'
            }
        )
    };

    const hideError = () => {

        let warning = document.getElementById("toast");
        warning.animate(
            [
                { opacity: 1 },
                { opacity: 0 },
            ],
            {
                duration: 150,
                easing: 'ease-in',
                fill: 'forwards'
            }
        ).onfinish = () => { setShowFeedback(false) }
    };



    return (
        <>
            <div id='toast' className='flex justify-center z-40'>
                {showFeedback &&
                    <><div role="alert" className="alert alert-success w-max justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{message}</span>
                    </div></>
                }
            </div>
        </>
    );
};

export default Toast;
