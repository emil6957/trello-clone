/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import {
    onSnapshot,
    collection,
    getFirestore,
    query,
    where,
    limit,
    QuerySnapshot,
    getDocs,
} from "firebase/firestore";
import "./Card.css";
import bin from "../../Images/bin.svg";

export default function Card({
    id,
    name,
    deleteCard,
    projectDocId,
    listDocId,
}) {
    const [showOptions, setShowOptions] = useState(false);
    const [cardDocId, setCardDocId] = useState();

    const db = getFirestore();

    useEffect(() => {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardQuery = query(cardsRef, where("id", "==", id), limit(1));

        const querySnapshot = getDocs(cardQuery)
            .then((snapshot) => {
                setCardDocId(snapshot.docs[0].id);
            });
    }, []);

    return (
        <div onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)} className="card">
            <h4 className="card__name">{name}</h4>
            {showOptions && (
                <div className="card__options">
                    <img onClick={() => deleteCard(listDocId, cardDocId)} className="card__delete" src={bin} alt="bin" />
                </div>
            )}
        </div>
    );
}
