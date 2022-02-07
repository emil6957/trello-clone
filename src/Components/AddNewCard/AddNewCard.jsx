import React from "react";
import "./AddNewCard.css";
import plus from "../../Images/plus.svg";

export default function AddNewCard() {
    return (
        <div className="add-new-card">
            <img className="add-new-card__plus" src={plus} alt="plus" />
            <p className="add-new-card__text">Add a new card</p>
        </div>
    );
}
