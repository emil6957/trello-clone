import React from "react";
import "./Header.css";
import Profile from "../Profile/Profile";
import chervron from "../../Images/chevron-left.svg";

export default function Header({ currentUser, signIn, signOutUser }) {
    return (
        <header className="header">
            <h2 className="header__title">Trollo</h2>
            <div className="header__btns">
                <div className="header__btn header-recent">
                    <p className="recent__text">Recent</p>
                    <img className="recent__img" src={chervron} alt="chevron" />
                </div>
                <p className="header__btn">Projects</p>
                <p className="header__btn header-create">Create</p>
            </div>
            {
                currentUser
                    ? <Profile currentUser={currentUser} signOutUser={signOutUser} />
                    : <button type="button" className="header__login" onClick={currentUser ? signOutUser : signIn}>{currentUser ? "Log Out" : "Log In"}</button>
            }
        </header>
    );
}
