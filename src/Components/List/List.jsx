import React from "react";
import "./List.css";
import plus from "../../Images/plus.svg";
import Card from "../Card/Card";

export default function List({ name }) {
    return (
        <div className="list">
            <h3 className="list__header">{name}</h3>
            <Card name="Test Card" />
            <div className="list__add-new-card">
                <img className="list__plus" src={plus} alt="plus" />
                <p className="list__add-new-card-text">Add a new card</p>
            </div>
        </div>
    );
}
