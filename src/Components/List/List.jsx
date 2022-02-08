import React from "react";
import "./List.css";
import AddNewCard from "../AddNewCard/AddNewCard";
import Card from "../Card/Card";

export default function List({ name }) {
    return (
        <div className="list">
            <div className="list__inner">
                <h3 className="list__header">{name}</h3>
                <Card name="Test Card" />
                <Card name="test Card 2" />
                <AddNewCard />
            </div>
        </div>
    );
}
