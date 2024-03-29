/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import "./ProjectCard.css";
import { Link } from "react-router-dom";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    updateDoc,
    where,
    limit,
    deleteDoc,
} from "firebase/firestore";
import star from "../../Images/star.svg";
import filledStar from "../../Images/star-filled.svg";
import bin from "../../Images/bin.svg";

export default function ProjectCard({
    updateTimestamp,
    project,
    deleteProject,
    currentUserPath,
}) {
    const [isFavourite, setIsFavourite] = useState(false);
    const [docId, setDocId] = useState();
    const db = getFirestore();

    useEffect(() => {
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);
        const projectQuery = query(projectsRef, where("id", "==", project.id));
        const unsubscribe = onSnapshot(projectQuery, (snapshot) => {
            setIsFavourite(snapshot.docs[0].data().isFavourite);
            setDocId(snapshot.docs[0].id);
        });
        return () => unsubscribe();
    }, []);

    function toggleFavourite() {
        const projectDoc = doc(db, `users/${currentUserPath}/projects/${docId}`);
        updateDoc(projectDoc, {
            isFavourite: !isFavourite,
        });
    }

    function deletePro(projectId) {
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);
        const projectQuery = query(projectsRef, where("id", "==", projectId), limit(1));
        getDocs(projectQuery)
            .then((snapshot) => {
                const projectDocId = snapshot.docs[0].id;
                const projectDoc = doc(db, `users/${currentUserPath}/projects/${projectDocId}`);
                deleteDoc(projectDoc);
            });
    }

    return (
        <div style={{ background: project.background }} className="project-card">
            <Link
                onClick={() => updateTimestamp(project.id)}
                to={project.id}
                project={project}
                key={project.id}
                className="project-card__link"
            >
                <p className="project-card__name">{project.name}</p>
            </Link>
            <div className="project-card__overlay">
                <img onClick={() => toggleFavourite()} className="project-card__star" src={isFavourite ? filledStar : star} alt="star" />
                <img onClick={() => deletePro(project.id)} className="project-card__bin" src={bin} alt="delete button" />
            </div>
        </div>
    );
}
