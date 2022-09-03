/* eslint-disable max-len */
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

    async function moveIndex(result) {
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        const listQuery = query(listsRef, where("id", "==", result.source.droppableId, limit(1)));
        const listSnapshot = await getDocs(listQuery);
        const listDocId = await listSnapshot.docs[0].id;
        const cardsRef = await collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardQuery = await query(cardsRef, where("id", "==", result.draggableId));
        const cardSnapshot = await getDocs(cardQuery);
        const cardDocId = await cardSnapshot.docs[0].id;
        const cardDoc = await doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDocId}`);
        updateDoc(cardDoc, {
            index: destinationIndex,
        });
        const isDestinationIndexHigher = destinationIndex > sourceIndex;
        const x = isDestinationIndexHigher ? "<=" : ">=";
        const y = isDestinationIndexHigher ? ">" : "<";
        const cardsQuery = await query(cardsRef, where("index", x, destinationIndex), where("index", y, sourceIndex));
        const cardsSnapshot = await getDocs(cardsQuery);
        const cardsToChange = [];

        cardsSnapshot.docs.forEach((document) => {
            if (document.id !== cardDocId) {
                cardsToChange.push({ id: document.id, index: document.data().index });
            }
        });

        cardsToChange.forEach((cardToChange) => {
            const cardToChangeDoc = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardToChange.id}`);
            updateDoc(cardToChangeDoc, {
                index: cardToChange.index + (isDestinationIndexHigher ? -1 : 1),
            });
        });
    }

    async function moveBoards(result) {
        const destinationIndex = result.destination.index;
        const sourceListQuery = query(listsRef, where("id", "==", result.source.droppableId), limit(1));
        const destinationListQuery = query(listsRef, where("id", "==", result.destination.droppableId), limit(1));
        const sourceListSnapshot = await getDocs(sourceListQuery);
        const sourceListDocId = await sourceListSnapshot.docs[0].id;
        const sourceCardsRef = await collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${sourceListDocId}/cards`);
        const cardQuery = await query(sourceCardsRef, where("id", "==", result.draggableId, limit(1)));
        const cardQuerySnapshot = await getDocs(cardQuery);
        const cardId = await cardQuerySnapshot.docs[0].id;
        const cardData = { ...cardQuerySnapshot.docs[0].data() };
        const cardDoc = await doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${sourceListDocId}/cards/${cardId}`);
        deleteDoc(cardDoc);

        const destinationListSnapshot = await getDocs(destinationListQuery);
        const destinationListDocId = destinationListSnapshot.docs[0].id;
        const destinationCardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${destinationListDocId}/cards`);
        const destinationCardToIncreaseQuery = query(destinationCardsRef, where("index", ">=", destinationIndex));
        const destinationCardToIncreaseSnapshot = await getDocs(destinationCardToIncreaseQuery);
        const cardsToIncrease = [];

        destinationCardToIncreaseSnapshot.docs.forEach((document) => {
            cardsToIncrease.push({ id: document.id, index: document.data().index });
        });

        cardsToIncrease.forEach((cardToIncrease) => {
            const cardToIncreaseDoc = doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${destinationListDocId}/cards/${cardToIncrease.id}`);
            updateDoc(cardToIncreaseDoc, {
                index: cardToIncrease.index + 1,
            });
        });

        addDoc(destinationCardsRef, {
            ...cardData,
            index: destinationIndex,
        });
    }

    function handleDragEnd(result) {
        if (!result.destination) return;
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
