/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import
{
    getFirestore,
    collection,
    getDocs,
    query,
    onSnapshot,
    where,
    getDoc,
    doc,
    limit,
    updateDoc,
    serverTimestamp,
    orderBy,
    deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import plus from "../../Images/plus.svg";
import "./Projects.css";
import NewProject from "../NewProject/NewProject";
import ProjectCard from "../ProjectCard/ProjectCard";

export default function Projects({ currentUser, currentUserPath }) {
    const [projects, setProjects] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [favouriteProjects, setFavouriteProjects] = useState([]);
    const [addNewProject, setAddNewProject] = useState(false);
    const db = getFirestore();

    useEffect(() => {
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);

        const projectsQuery = query(projectsRef);
        const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
            const data = snapshot.docs.map((document) => ({
                ...document.data(),
            }));
            setProjects(data);
        });
        const recentProjectsQuery = query(projectsRef, orderBy("timestamp", "desc"), limit(4));
        const unsubscribe2 = onSnapshot(recentProjectsQuery, (snapshot) => {
            const data = snapshot.docs.map((document) => ({
                ...document.data(),
            }));
            setRecentProjects(data);
        });
        const favouriteProjectsQuery = query(projectsRef, where("isFavourite", "==", true));
        const unsubscribe3 = onSnapshot(favouriteProjectsQuery, (snapshot) => {
            const data = snapshot.docs.map((document) => ({
                ...document.data(),
            }));
            setFavouriteProjects(data);
        });
        return () => { unsubscribe(); unsubscribe2(); unsubscribe3(); };
    }, [currentUserPath]);

    function toggleNewProject() {
        setAddNewProject((prevBool) => !prevBool);
    }

    function updateTimestamp(projectId) {
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);
        const projectQuery = query(projectsRef, where("id", "==", projectId), limit(1));
        getDocs(projectQuery)
            .then((snapshot) => {
                const projectDocId = snapshot.docs[0].id;
                const projectDoc = doc(db, `users/${currentUserPath}/projects/${projectDocId}`);
                updateDoc(projectDoc, {
                    timestamp: serverTimestamp(),
                });
            });
    }

    function deleteProject(projectId) {
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);
        const projectQuery = query(projectsRef, where("id", "==", projectId), limit(1));
        getDocs(projectQuery)
            .then((snapshot) => {
                const projectDocId = snapshot.docs[0].id;
                const projectDoc = doc(db, `users/${currentUserPath}/projects/${projectDocId}`);
                deleteDoc(projectDoc);
            });
    }

    const projectElements = projects.map((project) => (
        <ProjectCard updateTimestamp={(projectId) => updateTimestamp(projectId)} currentUserPath={currentUserPath} key={project.id} project={project} deleteProject={(projectId) => deleteProject(projectId)} className="projects__card" />
    ));
    const recentProjectElements = recentProjects.map((project) => (
        <ProjectCard updateTimestamp={(projectId) => updateTimestamp(projectId)} currentUserPath={currentUserPath} key={project.id} project={project} deleteProject={(projectId) => deleteProject(projectId)} className="projects__card" />
    ));
    const favouriteProjectElements = favouriteProjects.map((project) => (
        <ProjectCard updateTimestamp={(projectId) => updateTimestamp(projectId)} currentUserPath={currentUserPath} key={project.id} project={project} deleteProject={(projectId) => deleteProject(projectId)} className="projects__card" />
    ));

    return (
        <div className="projects">
            <div className="projects__section">
                <h3 className="projects__header">Recently Viewed</h3>
                <div className="project__items">
                    {recentProjectElements}
                </div>
            </div>
            <div className="projects__section">
                <h3 className="projects__header">Favourites</h3>
                <div className="project__items">
                    {favouriteProjectElements}
                </div>
            </div>
            <div className="projects__section">
                <h3 className="projects__header">All Projects</h3>
                <div className="project__items">
                    { projectElements }
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
