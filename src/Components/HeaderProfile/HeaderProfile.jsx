import React, { useState } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import "./HeaderProfile.css";

export default function HeaderProfile({ currentUser, signOutUser }) {
    const [showDropdown, setShowDropdown] = useState(false);

    function toggleDropdown() {
        setShowDropdown((prevBool) => !prevBool);
    }

    return (
        <div className="profile">
            <button className="profile__button" type="button" onClick={toggleDropdown}>
                <img className="profile__picture" src={currentUser.photoURL} alt="user profile" />
            </button>
            {showDropdown && (
                <ProfileDropdown
                    currentUser={currentUser}
                    signOutUser={signOutUser}
                />
            )}
        </div>
    );
}
