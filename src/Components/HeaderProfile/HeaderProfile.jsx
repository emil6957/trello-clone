import React, { useState, useEffect, useRef } from "react";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import "./HeaderProfile.css";

export default function HeaderProfile({ currentUser, signOutUser }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const profileRef = useRef();

    function toggleDropdown() {
        setShowDropdown((prevBool) => !prevBool);
    }

    useEffect(() => {
        const handler = (e) => {
            if (!profileRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className="profile" ref={profileRef}>
            <button className="profile__button" type="button" onClick={toggleDropdown}>
                <img className="profile__picture" src={currentUser.photoURL} alt="user profile" />
            </button>
            <div className={`profile__dropdown-container ${showDropdown ? "active" : "inactive"}`}>
                <ProfileDropdown
                    currentUser={currentUser}
                    signOutUser={signOutUser}
                    toggleDropdown={() => toggleDropdown()}
                />
            </div>
        </div>
    );
}
