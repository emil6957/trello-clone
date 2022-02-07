/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    collection,
    getFirestore,
    doc,
    getDocs,
    getDoc,
    where,
    query,
    onSnapshot,
    limit,
    addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import plus from "../../Images/plus.svg";
import cross from "../../Images/x.svg";
import AddNewList from "../AddNewList/AddNewList";
import List from "../List/List";
import "./InsideProject.css";

export default function InsideProject({ name, background }) {
    const [project, setProject] = useState();
    const [docId, setDocId] = useState();
    const [loaded, setLoaded] = useState(false);
    const [addNewList, setAddNewList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [lists, setLists] = useState([]);

    const { id } = useParams();

    const db = getFirestore();
    const projectsRef = collection(db, "users/BUhOFZWdEbuKVU4FIRMg/projects");

    useEffect(() => {
        const projectQuery = query(projectsRef, where("id", "==", id), limit(1));
        const unSubscribe = onSnapshot(projectQuery, (snapshot) => {
            console.log(snapshot.docs[0].data());
            setProject(snapshot.docs[0].data());
            setDocId(snapshot.docs[0].id);
            setLoaded(true);
        });
        return () => unSubscribe();
    }, []);

    function toggleAddNewList() {
        setAddNewList((prevBool) => !prevBool);
    }

    function handleNewListName(e) {
        const { value } = e.target;
        setNewListName(value);
    }

    function addList() {
        const listsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${docId}/lists`);
        addDoc(listsRef, {
            name: newListName,
        });
        setNewListName("");
    }

    const listElements = lists.map((list) => <div className="inside-project__list">{list}</div>);

    return (
        <div style={{ background: loaded && project.background }} className="inside-project">
            {listElements}
            <List name="Test List" />
            <AddNewList
                addNewList={addNewList}
                newListName={newListName}
                handleNewListName={(e) => handleNewListName(e)}
                addList={() => addList()}
                toggleAddNewList={() => toggleAddNewList()}
            />
        </div>
    );
}
