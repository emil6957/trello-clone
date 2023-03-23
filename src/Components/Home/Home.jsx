import React from "react";
import "./Home.css";
import AsideRecent from "../AsideRecent/AsideRecent";

export default function Home({ currentUserPath }) {
    return (
        <div className="home">
            <div className="home__caught-up">
                <h2 className="home__header">You&apos;re already all caught up</h2>
                <p className="home__paragraph">
                Your cards close to their
                due date and any activity
                on your projects will show up here
                </p>
            </div>
            <AsideRecent currentUserPath={currentUserPath} />
        </div>
    );
}
