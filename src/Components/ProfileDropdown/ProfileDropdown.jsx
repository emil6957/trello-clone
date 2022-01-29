import React from "react";
import "./ProfileDropdown.css";

export default function ProfileDropdown({ currentUser, signOutUser }) {
    return (
        <div className="profile-dropdown">
            <h4 className="profile-dropdown__header">Profile</h4>
            <div className="profile-dropdown__profile-info">
                <img className="profile-dropdown__img" src={currentUser.photoURL} alt="profile" />
                <div className="profile-info__flex-div">
                    <p className="profile-dropdown__user-name">{currentUser.displayName}</p>
                    <p className="profile-dropdown__email">{currentUser.email}</p>
                </div>
            </div>
            <hr />
            <div className="profile-dropdown__links">
                <p className="profile-dropdown__link">Profile</p>
                <p className="profile-dropdown__link">Settings</p>
                <p className="profile-dropdown__link">Contact</p>
            </div>
            <hr />
            <button type="button" className="profile-dropdown__log-out" onClick={signOutUser}>Log Out</button>
        </div>
    );
}
