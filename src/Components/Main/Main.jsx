import React from "react";
import "./Main.css";
import Home from "../Home/Home";
import Projects from "../Projects/Projects";
import AsideNav from "../AsideNav/AsideNav";

export default function Main({ currentUser, location }) {
    return (
        <main>
            <AsideNav />
            {location === "home" && <Home />}
            {location === "projects" && <Projects currentUser={currentUser} />}
        </main>
    );
}
