/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import "./AddNewCard.css";
import plus from "../../Images/plus.svg";
import cross from "../../Images/x.svg";

export default function AddNewCard({ newCardName, handleNewCardName, addCard }) {
    const [addNewCard, setAddNewCard] = useState(false);

    function toggleAddNewCard() {
        setAddNewCard((prevBool) => !prevBool);
    }

    return (
        addNewCard ? (
            <div className="add-new-card add-new-card--active">
                <input value={newCardName} onChange={(e) => handleNewCardName(e)} className="add-new-card__input" type="text" placeholder="Enter a title for this card..." autoComplete="off" />
                <div className="add-new-card__buttons">
                    <button onClick={() => { addCard(); toggleAddNewCard(); }} className="add-new-card__add-button" type="button">Add Card</button>
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
