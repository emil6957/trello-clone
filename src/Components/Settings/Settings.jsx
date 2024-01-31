/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import { React, useState, useEffect } from "react";
import "./Settings.css";
import { getAuth } from "firebase/auth";

export default function Settings({ currentUser }) {
    const [profilePicture, setProfilePicture] = useState();
    const [displayName, setDisplayName] = useState();
    const [accountEmail, setAccountEmail] = useState();

    const changeProfile = (profile, name, email) => {
        setProfilePicture(profile);
        setDisplayName(name);
        setAccountEmail(email);
    };

    return (
        <div className="settings">
            <div className="settings__top">
                <img src={profilePicture} alt="pfp" className="settings__top-pfp" />
                <h3 className="settings__top-name">{displayName}</h3>
                <p className="settings__top-email">{accountEmail}</p>
            </div>
            <div className="settings__bot">
                <form className="settings__bot-form">
                    <label htmlFor="displayName">UserName:</label>
                    <input id="displayName" name="displayName" type="text" />
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="text" />
                    <input type="button" onClick={() => changeProfile()} />
                </form>
            </div>
        </div>
    );
}
