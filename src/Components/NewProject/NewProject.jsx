import React from "react";
import "./NewProject.css";
import cross from "../../Images/x.svg";

export default function NewProject() {
    return (
        <div className="new-project">
            <div className="new-project__header-wrapper">
                <h4 className="new-project__header">New Project</h4>
                <img className="new-project__cross" src={cross} alt="cross" />
            </div>
            <div className="new-project__temp-div" />
            <div className="new-project__project-background">
                <h5 className="new-project__project-background__header">Project Background</h5>
            </div>
            <div className="new-project__project-name">
                <h5 className="new-project__project-name__header">Name</h5>
                <input type="text" />
            </div>
        </div>
    );
}
