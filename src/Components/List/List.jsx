/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import "./List.css";
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
    getFirestore,
    orderBy,
} from "firebase/firestore";
import { Draggable } from "react-beautiful-dnd";
import AddNewCard from "../AddNewCard/AddNewCard";
import Card from "../Card/Card";
import bin from "../../Images/bin.svg";
import edit from "../../Images/edit.svg";
import tick from "../../Images/tick.svg";
import cross from "../../Images/x.svg";

export default function List(
    {
        newCardName,
        handleNewCardName,
        addCard,
        name,
        projectDocId,
        id,
        deleteCard,
        setListCards,
        cards,
    },
) {
    // const [cards, setCards] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [listDocId, setListDocId] = useState();
    const [newName, setNewName] = useState(name);
    const [editing, setEditing] = useState(false);
    const db = getFirestore();

    useEffect(() => {
        const listsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists`);
        const listQuery = query(listsRef, where("id", "==", id), limit(1));
        const unSubscribe = onSnapshot(listQuery, (snapshot) => {
            setListDocId(snapshot.docs[0].id);
        });

        return () => unSubscribe();
    }, []);

    useEffect(() => {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardsQuery = query(cardsRef, orderBy("index", "asc"));
        const unSubscribe = onSnapshot(cardsQuery, (snapshot) => {
            const cardsData = [];
            snapshot.docs.forEach((document) => cardsData.push(document.data()));
            // setCards(cardsData);
            setCardIndex(cardsData.length);
            setListCards(id, cardsData);
        });
        return () => unSubscribe();
    }, [listDocId]);

    function editList() {
        updateDoc(doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}`), {
            name: newName,
        });
    }

    function toggleEditList() {
        setNewName(name);
        setEditing((prevBool) => !prevBool);
    }

    function handleChange(e) {
        setNewName(e.target.value);
    }

    function handleOnKeyDown(e) {
        if (e.keyCode === 13) {
            editList(newName);
        }
        if (e.keyCode === 27) {
            toggleEditList();
        }
    }

    const cardElements = cards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                >
                    <Card
                        id={card.id}
                        name={card.name}
                        listDocId={listDocId}
                        projectDocId={projectDocId}
                        deleteCard={deleteCard}
                    />
                </div>
            )}
        </Draggable>
    ));

    return (
        <div className="list">
            <div className="list__inner">
                <h3 className="list__header">{name}</h3>
                {cardElements}
                <AddNewCard
                    newCardName={newCardName}
                    handleNewCardName={handleNewCardName}
                    addCard={addCard}
                    listDocId={listDocId}
                    cardIndex={cardIndex}
                />
            </div>
        </div>
    );
}
