import React from "react";
import "./Card.css";

export default function Card({ name }) {
    return (
        <div className="card">
            <h4 className="card__name">{name}</h4>
        </div>
    );
}
