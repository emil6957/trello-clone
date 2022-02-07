import React from "react";
import "./List.css";
import AddNewCard from "../AddNewCard/AddNewCard";
import Card from "../Card/Card";

export default function List({ name }) {
    return (
        <div className="list">
            <h3 className="list__header">{name}</h3>
            <Card name="Test Card" />
            <AddNewCard />
        </div>
    );
}
