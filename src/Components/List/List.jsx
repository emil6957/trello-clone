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
    doc,
    updateDoc,
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
        deleteList,
        currentUserPath,
    },
) {
    // const [cards, setCards] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [listDocId, setListDocId] = useState();
    const [newName, setNewName] = useState(name);
    const [editing, setEditing] = useState(false);
    const db = getFirestore();

    useEffect(() => {
        const listsRef = collection(db, `users/${currentUserPath}/projects/${projectDocId}/lists`);
        const listQuery = query(listsRef, where("id", "==", id), limit(1));
        const unSubscribe = onSnapshot(listQuery, (snapshot) => {
            setListDocId(snapshot.docs[0].id);
        });

        return () => unSubscribe();
    }, []);

    useEffect(() => {
        const cardsRef = collection(db, `users/${currentUserPath}/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardsQuery = query(cardsRef, orderBy("index", "asc"));
        const unSubscribe = onSnapshot(cardsQuery, (snapshot) => {
            const cardsData = [];
            snapshot.docs.forEach((document) => cardsData.push(document.data()));
            setCardIndex(cardsData.length);
            setListCards(id, cardsData);
        });
        return () => unSubscribe();
    }, [listDocId]);

    function editList(editedName) {
        updateDoc(doc(db, `users/${currentUserPath}/projects/${projectDocId}/lists/${listDocId}`), {
            name: editedName,
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
                {editing ? (
                    <div className="list__header">
                        <input ref={(input) => input && input.focus()} onKeyDown={(e) => handleOnKeyDown(e)} onChange={(e) => handleChange(e)} className="list__header-text" type="text" value={newName} />
                        <div className="list__options-editing">
                            <button onClick={() => editList(newName)} type="button" className="list__header-btn"><img className="list__header-tick" src={tick} alt="tick" /></button>
                            <button onClick={() => toggleEditList()} type="button" className="list__header-btn"><img className="list__header-cross" src={cross} alt="cross" /></button>
                        </div>
                    </div>
                ) : (
                    <div className="list__header">
                        <h3 className="list__header-text">{name}</h3>
                        <div className="list__options">
                            <button onClick={() => deleteList(listDocId)} type="button" className="list__header-btn"><img className="list_header-btn-img" src={bin} alt="bin" /></button>
                            <button onClick={() => toggleEditList()} type="button" className="list__header-btn"><img className="list_header-btn-img" src={edit} alt="edit" /></button>
                        </div>
                    </div>
                )}
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
