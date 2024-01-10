/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useEffect } from "react";
import "./HeaderRecent.css";
import { Link } from "react-router-dom";
import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from "firebase/firestore";
import cross from "../../Images/x.svg";

export default function HeaderRecent({ handleRecents, currentUserPath }) {
    const [recentProjects, setRecentProjects] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);
        const recentProjectsQuery = query(projectsRef, orderBy("timestamp", "desc"));
        getDocs(recentProjectsQuery)
            .then((snapshot) => {
                const data = snapshot.docs.map((document) => ({
                    ...document.data(),
                }));
                setRecentProjects(data);
            });
    }, [currentUserPath]);

    const recentProjectElements = recentProjects.map((project) => (
        <div onClick={handleRecents}>
            <Link to={`projects/${project.id}`} className="header-recent__project" key={project.id}>
                <div
                    style={{ background: project.background, backgroundRepeat: "no-repeat" }}
                    className="header-recent__project-img"
                />
                <p className="header-recent__project-name">{project.name}</p>
            </Link>
        </div>
    ));

    return (
        <div className="header-recent">
            <div className="header-recent__header">
                <p className="header-recent__title">Recent Boards</p>
            </div>
            <hr />
            <div className="header-recent__projects">
                { recentProjects.length ? recentProjectElements : <p>You have no projects</p> }
            </div>
        </div>
    );
}
