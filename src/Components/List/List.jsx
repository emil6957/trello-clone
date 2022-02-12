import React from "react";
import "./List.css";
import AddNewCard from "../AddNewCard/AddNewCard";
import Card from "../Card/Card";

export default function List({
    newCardName,
    handleNewCardName,
    addCard,
    name,
}) {
    return (
        <div className="list">
            <div className="list__inner">
                <h3 className="list__header">{name}</h3>
                <Card name="Test Card" />
                <Card name="test Card 2" />
                <AddNewCard
                    newCardName={newCardName}
                    handleNewCardName={handleNewCardName}
                    addCard={addCard}
                />
            </div>
        </div>
    );
}
