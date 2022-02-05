/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from "react";
import
{
    getFirestore,
    collection,
    getDocs,
} from "firebase/firestore";
import plus from "../../Images/plus.svg";
import "./Projects.css";
import NewProject from "../NewProject/NewProject";

export default function Projects({ currentUser }) {
    const [projects, setProjects] = useState();
    const [addNewProject, setAddNewProject] = useState(false);

    useEffect(() => {
        const db = getFirestore();
        const projectsCol = collection(db, "projects");
        getDocs(projectsCol)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    setProjects((prevProjects) => ({ ...prevProjects, ...doc.data() }));
                });
            });
    }, []);

    function toggleNewProject() {
        setAddNewProject((prevBool) => !prevBool);
    }

    return (
        <div className="projects">
            <div className="projects__section">
                <h3 className="projects__header">Recently Viewed</h3>
                <div className="project__items">
                    <div className="temp-div" />
                    <div className="temp-div" />
                    <div className="temp-div" />
                    <div className="temp-div" />
                </div>
            </div>
            <div className="projects__section">
                <h3 className="projects__header">Favourites</h3>
                <div className="project__items">
                    <div className="temp-div" />
                </div>
            </div>
            <div className="projects__section">
                <h3 className="projects__header">All Projects</h3>
                <div className="project__items">
                    <div className="temp-div" />
                    <div className="projects__new-project-container">
                        <div onClick={toggleNewProject} className="projects__new-project">
                            <img className="projects__plus" src={plus} alt="plus" />
                        </div>
                        {addNewProject && (
                            <NewProject
                                currentUser={currentUser}
                                closeNewProject={() => toggleNewProject()}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
