/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import "./AddNewCard.css";
import plus from "../../Images/plus.svg";
import cross from "../../Images/x.svg";

export default function AddNewCard({
    listDocId,
    newCardName,
    handleNewCardName,
    addCard,
    cardIndex,
}) {
    const [addNewCard, setAddNewCard] = useState(false);
    function toggleAddNewCard() {
        setAddNewCard((prevBool) => !prevBool);
    }

    function submitCard(docId, index) {
        addCard(docId, index);
        toggleAddNewCard();
    }

    function handleKeypress(e, docId, index) {
        if (e.charCode === 13) {
            submitCard(docId, index);
        }
    }

    return (
        addNewCard ? (
            <div className="add-new-card add-new-card--active">
                <input ref={(input) => input && input.focus()} value={newCardName} onChange={(e) => handleNewCardName(e)} onKeyPress={(e) => handleKeypress(e, listDocId, cardIndex)} className="add-new-card__input" type="text" placeholder="Enter a title for this card..." autoComplete="off" />
                <div className="add-new-card__buttons">
                    <button onClick={() => submitCard(listDocId, cardIndex)} className="add-new-card__add-button" type="button">Add Card</button>
                    <img onClick={() => toggleAddNewCard()} className="add-new-card__cross" src={cross} alt="cross" />
                </div>
            </div>
        )
            : (
                <div onClick={() => toggleAddNewCard()} className="add-new-card add-new-card--inactive">
                    <img className="add-new-card__plus" src={plus} alt="plus" />
                    <p className="add-new-card__text">Add a new card</p>
                </div>
            )
    );
}
