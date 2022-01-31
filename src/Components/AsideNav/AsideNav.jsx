import React from "react";
import { Link } from "react-router-dom";
import "./AsideNav.css";

export default function AsideNav() {
    return (
        <aside className="aside-nav">
            <nav>
                <Link className="aside-nav__link" to="/">Home</Link>
                <Link className="aside-nav__link" to="/projects">Projects</Link>
                <Link className="aside-nav__link" to="/templates">Templates</Link>
            </nav>
        </aside>
    );
}
