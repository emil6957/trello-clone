import React, { useEffect, useState } from "react";
import "./AsideRecent.css";
import {
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
} from "firebase/firestore";
import { Link } from "react-router-dom";

export default function AsideRecent() {
    const [projects, setProjects] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const projectsRef = collection(db, "users/BUhOFZWdEbuKVU4FIRMg/projects");
        const recentProjectsQuery = query(projectsRef, orderBy("timestamp", "desc"), limit(5));
        getDocs(recentProjectsQuery)
            .then((snapshot) => {
                const data = snapshot.docs.map((document) => ({
                    ...document.data(),
                }));
                setProjects(data);
            });
    }, []);

    const projectElements = projects.map((project) => (
        <Link to={`projects/${project.id}`} className="aside-recent__project" key={project.id}>
            <div
                style={{ background: project.background }}
                className="aside-recent__project-img"
            />
            <p className="aside-recent__project-name">{project.name}</p>
        </Link>
    ));

    return (
        <aside className="aside-recent">
            <h4 className="aside-recent__header">Recently Viewed</h4>
            <div className="aside-recent__projects">
                {projectElements}
            </div>
        </aside>
    );
}
