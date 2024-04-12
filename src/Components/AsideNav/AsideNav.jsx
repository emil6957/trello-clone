import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AsideNav.css";

export default function AsideNav({ location }) {
    return (
        <aside className="aside-nav">
            <nav>
                <Link style={{ color: location === "home" && "#2A8CFF", backgroundColor: location === "home" && "#C8E1FF" }} className="aside-nav__link" to="/">Home</Link>
                <Link style={{ color: location === "projects" && "#2A8CFF", backgroundColor: location === "projects" && "#C8E1FF" }} className="aside-nav__link" to="/projects">Projects</Link>
            </nav>
        </aside>
    );
}
