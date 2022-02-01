import React from "react";
import plus from "../../Images/plus.svg";
import "./Projects.css";
import NewProject from "../NewProject/NewProject";

export default function Projects() {
    return (
        <div className="projects">
            <div className="projects__section">
                <h3 className="projects__section__header">Recently Viewed</h3>
                <div className="project__items">
                    <div className="temp-div" />
                    <div className="temp-div" />
                    <div className="temp-div" />
                    <div className="temp-div" />
                </div>
            </div>
            <div className="projects__section">
                <h3 className="projects__section__header">Favourites</h3>
                <div className="project__items">
                    <div className="temp-div" />
                </div>
            </div>
            <div className="projects__section">
                <h3 className="projects__section__header">All Projects</h3>
                <div className="project__items">
                    <div className="temp-div" />
                    <div className="add-new-project">
                        <img className="plus" src={plus} alt="plus" />
                        <NewProject />
                    </div>
                </div>
            </div>
        </div>
    );
}
