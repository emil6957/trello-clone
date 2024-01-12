/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import "./NewProject.css";
import { nanoid } from "nanoid";
import {
    getFirestore,
    collection,
    getDoc,
    addDoc,
    serverTimestamp,
    getDocs,
    updateDoc,
    doc,
    setDoc,
} from "firebase/firestore";
import cross from "../../Images/x.svg";
import NewProjectBackground from "../NewProjectBackground/NewProjectBackground";

export default function NewProject({ currentUser, closeNewProject }) {
    const [projectName, setProjectName] = useState("");
    const [projectBackground, setProjectBackground] = useState({ background: "#808080" });

    const db = getFirestore();
    const usersRef = collection(db, "users");

    function handleName(e) {
        const { value } = e.target;
        setProjectName(value);
    }

    function handleBackground(type, background) {
        if (type === "img") {
            setProjectBackground({ background: `url("${background}") center center / cover` });
        } else {
            setProjectBackground({ background: `#${background}` });
        }
    }

    function addNewProject(id) {
        const projectId = nanoid();
        setDoc(doc(db, `users/${id}/projects`, projectId), {
            name: projectName,
            background: projectBackground.background,
            isFavourite: false,
            timestamp: serverTimestamp(),
            id: projectId,
        });
    }

    async function addNewUser() {
        const newUser = await addDoc(usersRef, {
            uid: currentUser.uid,
        });
        return newUser;
    }

    function createProject() {
        getDocs(usersRef)
            .then(async (snapshot) => {
                let isUserInDatabase = false;
                snapshot.docs.forEach((document) => {
                    if (document.data().uid === currentUser.uid) {
                        isUserInDatabase = true;
                        addNewProject(document.id);
                    }
                });
                if (!isUserInDatabase) {
                    const newUser = await addNewUser();
                    addNewProject(newUser.id);
                }
            });
        closeNewProject();
    }

    return (
        <div className="new-project">
            <div className="new-project__header-wrapper">
                <h4 className="new-project__header">New Project</h4>
                <img onClick={closeNewProject} className="new-project__cross" src={cross} alt="cross" />
            </div>
            <NewProjectBackground
                projectBackground={projectBackground}
                handleBackground={(type, background) => handleBackground(type, background)}
            />
            <div className="new-project__project-name">
                <h5 className="new-project__project-name-header">Name</h5>
                <input onChange={(e) => handleName(e)} value={projectName} className={`new-project__input ${!projectName && "input--invalid"}`} type="text" />
                {!projectName && <p className="new-project__err">Name is required</p>}
            </div>
            <div className="new-project__btns">
                <button onClick={createProject} className={`new-project__btn ${!projectName && "btn--disabled"}`} type="button" disabled={!projectName}>Create</button>
                <button className="new-project__btn btn--disabled" type="button" disabled>Template</button>
            </div>
        </div>
    );
}
