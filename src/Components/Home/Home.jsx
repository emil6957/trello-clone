import React from "react";
import "./Home.css";
import AsideRecent from "../AsideRecent/AsideRecent";

export default function Home() {
    return (
        <div className="home">
            <div className="home__caught-up">
                <h2 className="home__caught-up__header">You&apos;re already all caught up</h2>
                <p className="home__caught-up-paragraph">
                Your cards close to their
                due date and any activity
                on your projects will show up here
                </p>
            </div>
            <AsideRecent />
        </div>
    );
}
