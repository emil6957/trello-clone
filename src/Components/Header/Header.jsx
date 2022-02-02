import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import HeaderProfile from "../HeaderProfile/HeaderProfile";
import chervron from "../../Images/chevron-left.svg";

export default function Header({ currentUser, signIn, signOutUser }) {
    return (
        <header className="header">
            <h2 className="header__title">Trollo</h2>
            {
                currentUser
                    && (
                        <div className="header__btns">
                            <div className="header__btn header__recent">
                                <p className="header__recent-text">Recent</p>
                                <img className="header__recent-img" src={chervron} alt="chevron" />
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
