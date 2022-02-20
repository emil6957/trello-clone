/* eslint-disable jsx-a11y/mouse-events-have-key-events */
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
    updateDoc,
    doc,
} from "firebase/firestore";
import "./Card.css";
import bin from "../../Images/bin.svg";
import edit from "../../Images/edit.svg";
import cross from "../../Images/x.svg";
import tick from "../../Images/tick.svg";

export default function Card({
    id,
    name,
    deleteCard,
    projectDocId,
    listDocId,
}) {
    const [showOptions, setShowOptions] = useState(false);
    const [cardDocId, setCardDocId] = useState();
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const db = getFirestore();

    useEffect(() => {
        const cardsRef = collection(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards`);
        const cardQuery = query(cardsRef, where("id", "==", id), limit(1));

        getDocs(cardQuery)
            .then((snapshot) => {
                setCardDocId(snapshot.docs[0].id);
            });
    }, []);

    function editCard() {
        updateDoc(doc(db, `users/BUhOFZWdEbuKVU4FIRMg/projects/${projectDocId}/lists/${listDocId}/cards/${cardDocId}`), {
            name: newName,
        });
    }

    function toggleEditing() {
        setEditing((prevBool) => !prevBool);
    }

    function handleChange(e) {
        const { value } = e.target;
        setNewName(value);
    }

    return (
        editing ? (
            <div className="card__editing">
                <input onChange={(e) => handleChange(e)} className="card__edit-input" value={newName} />
                <div className="card__edit-options">
                    <img onClick={() => { editCard(); toggleEditing(); }} className="card__tick" src={tick} alt="tick" />
                    <img onClick={() => { toggleEditing(); setNewName(name); }} className="card__cross" src={cross} alt="cross" />
                </div>
            </div>
        )
            : (
                <div onMouseOver={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)} className="card">
                    <h4 className="card__name">{name}</h4>
                    {showOptions && (
                        <div className="card__options">
                            <img onClick={() => deleteCard(listDocId, cardDocId)} className="card__delete" src={bin} alt="bin" />
                            <img onClick={() => toggleEditing()} className="card__edit" src={edit} alt="edit" />
                        </div>
                    )}
                </div>
            )
    );
}
