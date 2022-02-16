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
import AddNewCard from "../AddNewCard/AddNewCard";
import Card from "../Card/Card";

export default function List(
    {
        newCardName,
        handleNewCardName,
        addCard,
        name,
        projectDocId,
        id,
        deleteCard,
    },
) {
    const [cards, setCards] = useState([]);
    const [listDocId, setListDocId] = useState();
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
        const cardsQuery = query(cardsRef);
        const unSubscribe = onSnapshot(cardsQuery, (snapshot) => {
            const cardsData = [];
            snapshot.docs.forEach((document) => cardsData.push(document.data()));
            setCards(cardsData);
        });
        return () => unSubscribe();
    }, [listDocId]);

    const cardElements = cards.map((card) => (
        <Card
            key={card.id}
            id={card.id}
            name={card.name}
            listDocId={listDocId}
            projectDocId={projectDocId}
            deleteCard={deleteCard}
        />
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
                />
            </div>
        </div>
    );
}
