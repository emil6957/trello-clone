/* eslint-disable no-useless-return */
/* eslint-disable react/jsx-props-no-spreading */
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
    deleteDoc,
    orderBy,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import plus from "../../Images/plus.svg";
import cross from "../../Images/x.svg";
import AddNewList from "../AddNewList/AddNewList";
import List from "../List/List";
import "./InsideProject.css";

export default function InsideProject({ name, background }) {
    const [project, setProject] = useState();
    const [projectDocId, setDocId] = useState();
    const [loaded, setLoaded] = useState(false);
    const [addNewList, setAddNewList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newCardName, setNewCardName] = useState("");
    const [lists, setLists] = useState([]);

    const { id } = useParams();

    const db = getFirestore();
    const projectsRef = collection(db, "users/BUhOFZWdEbuKVU4FIRMg/projects");
    const listsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists`);

    useEffect(() => {
        const projectQuery = query(projectsRef, where("id", "==", id), limit(1));
        const unSubscribe = onSnapshot(projectQuery, (snapshot) => {
            setProject(snapshot.docs[0].data());
            setDocId(snapshot.docs[0].id);
            setLoaded(true);
        });

        return () => unSubscribe();
    }, []);

    useEffect(() => {
        const listsQuery = query(listsRef);
        const unSubscribe = onSnapshot(listsQuery, (snapshot) => {
            const listData = [];
            snapshot.docs.forEach((document) => listData.push(document.data()));
            setLists(listData);
        });

        return () => unSubscribe();
    }, [projectDocId]);

    function toggleAddNewList() {
        setAddNewList((prevBool) => !prevBool);
    }

    function handleNewListName(e) {
        const { value } = e.target;
        setNewListName(value);
    }

    function handleNewCardName(e) {
        const { value } = e.target;
        setNewCardName(value);
    }

    function addList() {
        addDoc(listsRef, {
            name: newListName,
            id: nanoid(),
        });
        setNewListName("");
    }

    function addCard(listDocId, cardIndex) {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        addDoc(cardsRef, {
            name: newCardName,
            id: nanoid(),
            index: cardIndex,
        });
        setNewCardName("");
    }

    async function reIndexCards(listDocId, docIndex) {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardsQuery = (cardsRef, orderBy("index", "asc"), where("index", ">", docIndex));
        const cardsArray = [];
        getDocs(cardsRef)
            .then((snapshot) => {
                snapshot.docs.forEach((document) => {
                    if (document.data().index > docIndex) {
                        cardsArray.push({ index: document.data().index, id: document.id });
                    }
                });
            })
            .then(() => {
                cardsArray.forEach((cardDoc) => {
                    const document = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDoc.id}`);
                    updateDoc(document, {
                        index: cardDoc.index - 1,
                    });
                });
            });
    }

    function deleteCard(listDocId, cardDocId) {
        const document = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDocId}`);
        getDoc(document)
            .then((snapshot) => {
                reIndexCards(listDocId, snapshot.data().index);
                deleteDoc(document);
            });
    }

    const listElements = lists.map((list) => (
        <Droppable key={list.id} droppableId={list.id}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <List
                        id={list.id}
                        name={list.name}
                        projectDocId={projectDocId}
                        newCardName={newCardName}
                        handleNewCardName={(e) => handleNewCardName(e)}
                        addCard={(listDocId, cardIndex) => addCard(listDocId, cardIndex)}
                        deleteCard={(listDocId, cardDocId) => deleteCard(listDocId, cardDocId)}
                    />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    ));

    function moveIndex(result) {
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        const listQuery = query(listsRef, where("id", "==", result.source.droppableId, limit(1)));
        getDocs(listQuery)
            .then((listSnapshot) => {
                const listDocId = listSnapshot.docs[0].id;
                const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
                const cardQuery = query(cardsRef, where("id", "==", result.draggableId));
                getDocs(cardQuery)
                    .then((cardSnapshot) => {
                        const cardDocId = cardSnapshot.docs[0].id;
                        const cardDoc = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDocId}`);
                        updateDoc(cardDoc, {
                            index: destinationIndex,
                        });
                        if (destinationIndex > sourceIndex) {
                            const cardsQuery = query(cardsRef, where("index", "<=", destinationIndex), where("index", ">", sourceIndex));
                            getDocs(cardsQuery)
                                .then((cardsSnapshot) => {
                                    const cardsToReduce = [];
                                    cardsSnapshot.docs.forEach((document) => {
                                        if (document.id !== cardDocId) {
                                            // eslint-disable-next-line max-len
                                            cardsToReduce.push({ id: document.id, index: document.data().index });
                                            console.log(document.data());
                                        }
                                    });
                                    cardsToReduce.forEach((cardToReduce) => {
                                        const cardToReduceDoc = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardToReduce.id}`);
                                        updateDoc(cardToReduceDoc, {
                                            index: cardToReduce.index - 1,
                                        });
                                    });
                                });
                        } else {
                            const cardsQuery = query(cardsRef, where("index", ">=", destinationIndex), where("index", "<", sourceIndex));
                            getDocs(cardsQuery)
                                .then((cardsSnapshot) => {
                                    const cardsToIncrease = [];
                                    cardsSnapshot.docs.forEach((document) => {
                                        if (document.id !== cardDocId) {
                                            // eslint-disable-next-line max-len
                                            cardsToIncrease.push({ id: document.id, index: document.data().index });
                                            console.log(document.data());
                                        }
                                    });
                                    cardsToIncrease.forEach((cardToIncrease) => {
                                        const cardToIncreaseDoc = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardToIncrease.id}`);
                                        updateDoc(cardToIncreaseDoc, {
                                            index: cardToIncrease.index + 1,
                                        });
                                    });
                                });
                        }
                    });
            });
    }

    function moveBoards(result) {

    }

    function handleDragEnd(result) {
        if (!result.destination) return;
        console.log(result);
        if (result.destination.droppableId === result.source.droppableId) {
            moveIndex(result);
        } else {
            moveBoards(result);
        }
    }

    return (
        <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
            <div style={{ background: loaded && project.background }} className="inside-project">
                {listElements}
                <AddNewList
                    addNewList={addNewList}
                    newListName={newListName}
                    handleNewListName={(e) => handleNewListName(e)}
                    addList={() => addList()}
                    toggleAddNewList={() => toggleAddNewList()}
                />
            </div>
        </DragDropContext>
    );
}
