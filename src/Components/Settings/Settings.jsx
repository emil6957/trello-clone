/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import { React, useState, useEffect } from "react";
import "./Settings.css";
import { getAuth } from "firebase/auth";
import {
    doc,
    deleteDoc,
    getFirestore,
    updateDoc,
    deleteField,
    collection,
    query,
    getDocs,
} from "firebase/firestore";

export default function Settings({ currentUser, currentUserPath }) {
    const [profilePicture, setProfilePicture] = useState(currentUser.photoURL);
    const [displayName, setDisplayName] = useState(currentUser.displayName);
    const [accountEmail, setAccountEmail] = useState(currentUser.email);

    const db = getFirestore();

    function deleteAllProjects(projectId) {
        const confirmation = prompt("Are you sure you want to do this,\n Type 'I am sure' to confirm");
        console.log(confirmation);
        if (confirmation !== "I am sure") {
            return;
        }
        const projectsRef = collection(db, `users/${currentUserPath}/projects`);
        const projectQuery = query(projectsRef);
        getDocs(projectQuery)
            .then((snapshot) => {
                const projectDocId = snapshot.docs[0].id;
                snapshot.docs.forEach((document) => {
                    const projectDoc = doc(db, `users/${currentUserPath}/projects/${document.id}`);
                    deleteDoc(projectDoc);
                });
            });
    }

    return (
        <div className="settings">
            <div className="settings__top">
                <img src={profilePicture} alt="pfp" className="settings__top-pfp" />
                <h3 className="settings__top-name">{displayName}</h3>
                <p className="settings__top-email">{accountEmail}</p>
            </div>
            <div className="settings__bot">
                <button type="button" onClick={() => deleteAllProjects()} className="settings__bot-delete-btn">Delete All Projects</button>
            </div>
        </div>
    );
}
