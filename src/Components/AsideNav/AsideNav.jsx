import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AsideNav.css";

export default function AsideNav({ location }) {
    return (
        <aside className="aside-nav">
            <nav>
                <Link style={{ backgroundColor: location === "home" && "#C8E1FF" }} className="aside-nav__link" to="/">Home</Link>
                <Link style={{ backgroundColor: location === "projects" && "#C8E1FF" }} className="aside-nav__link" to="/projects">Projects</Link>
                <Link style={{ backgroundColor: location === "templates" && "#C8E1FF" }} className="aside-nav__link" to="/templates">Templates</Link>
            </nav>
        </aside>
    );
}
