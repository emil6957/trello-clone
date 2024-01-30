import React from "react";
import "./GetStarted.css";
import google from "../../Images/google-icon.svg";

export default function GetStarted({ signIn, signInAsGuest }) {
    return (
        <div className="get-started">
            <div className="get-started__inner">
                <h1 className="get-started__title">A new way to organise your work</h1>
                <p className="get-started__paragraph">
                    Have a new way to organise and manage all your projects
                    with our simple and easy to use yet powerful site. You&apos;re
                    only one click away from getting to work.
                </p>
                <div className="get-started__btns-container">
                    <button type="button" className="get-started__btn" onClick={signIn}>
                        <img className="get-started__btn-img" src={google} alt="google logo" />
                        <p className="get-started__btn-text">Log in with google</p>
                    </button>
                    <button type="button" className="get-started__btn" onClick={signInAsGuest}>
                        <p className="get-started__btn-text">Continue as Guest</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
