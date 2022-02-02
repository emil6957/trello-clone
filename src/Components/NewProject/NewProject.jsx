import React, { useState } from "react";
import "./NewProject.css";
import cross from "../../Images/x.svg";
import NewProjectBackground from "../NewProjectBackground/NewProjectBackground";

export default function NewProject() {
    const [projectName, setProjectName] = useState("");
    const [projectBackground, setProjectBackground] = useState({ background: "" });

    function handleName(e) {
        const { value } = e.target;
        setProjectName(value);
    }

    function handleBackground(type, background) {
        if (type === "img") {
            setProjectBackground({ background: `url("${background}") center center / 100%` });
        } else {
            setProjectBackground({ background: `#${background}` });
        }
    }

    function createProject() {
    }

    return (
        <div className="new-project">
            <div className="new-project__header-wrapper">
                <h4 className="new-project__header">New Project</h4>
                <img className="new-project__cross" src={cross} alt="cross" />
            </div>
            <NewProjectBackground
                projectBackground={projectBackground}
                handleBackground={() => handleBackground()}
            />
            <div className="new-project__project-name">
                <h5 className="new-project__project-name-header">Name</h5>
                <input onChange={(e) => handleName(e)} value={projectName} className={`new-project__input ${!projectName && "input--invalid"}`} type="text" />
                {!projectName && <p className="new-project__err">Name is required</p>}
            </div>
            <div className="new-project__btns">
                <button onClick={createProject} className={`new-project__btn ${!projectName && "btn--disabled"}`} type="button">Create</button>
                <button className="new-project__btn" type="button">Template</button>
            </div>
        </div>
    );
}
