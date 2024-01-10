/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import HeaderProfile from "../HeaderProfile/HeaderProfile";
import chervron from "../../Images/chevron-left.svg";
import HeaderRecent from "../HeaderRecent/HeaderRecent";

export default function Header({
    currentUser,
    currentUserPath,
    signIn,
    signOutUser,
}) {
    const [showRecents, setShowRecents] = useState(false);

    const headerRecentRef = useRef();

    function handleRecents() {
        setShowRecents((prevState) => !prevState);
    }

    useEffect(() => {
        const handler = (e) => {
            if (!headerRecentRef.current.contains(e.target)) {
                setShowRecents(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <header className="header">
            <h2 className="header__title"><Link to="/" className="header__home-btn">Trollo</Link></h2>
            {
                currentUser
                    && (
                        <div className="header__btns">
                            <div className="header__recent" ref={headerRecentRef}>
                                <button type="button" className="header__btn" onClick={handleRecents}>
                                    <p className="header__recent-text">Recent</p>
                                    <img className="header__recent-img" src={chervron} alt="chevron" />
                                </button>
                                <div className={`header__recent-container ${showRecents ? "active" : "inactive"}`}>
                                    <HeaderRecent currentUserPath={currentUserPath} handleRecents={() => handleRecents()} />
                                </div>
                            </div>
                            <Link to="/projects" className="header__btn">Projects</Link>
                            <p className="header__btn header__create-text">Create</p>
                        </div>
                    )
            }
            {
                currentUser
                    ? <HeaderProfile currentUser={currentUser} signOutUser={signOutUser} />
                    : <button type="button" className="header__login" onClick={currentUser ? signOutUser : signIn}>Log In</button>
            }
        </header>
    );
}
