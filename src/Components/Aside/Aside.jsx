import React from "react";
import { Link } from "react-router-dom";
import "./Aside.css";

export default function Aside() {
    return (
        <aside>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/templates">Templates</Link>
        </aside>
    );
}
