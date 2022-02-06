/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import plus from "../../Images/plus.svg";
import cross from "../../Images/x.svg";
import "./InsideProject.css";

export default function InsideProject({ name, background }) {
    const [addNewList, setAddNewList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [lists, setLists] = useState([]);

    function toggleAddNewList() {
        setAddNewList((prevBool) => !prevBool);
    }

    function handleNewListName(e) {
        const { value } = e.target;
        setNewListName(value);
    }

    function addList() {
        setLists((prevLists) => [...prevLists, newListName]);
        setNewListName("");
    }

    const listElements = lists.map((list) => <div className="inside-project__list">{list}</div>);

    return (
        <div styles={{ background }} className="inside-project">
            {listElements}
            {addNewList
                ? (
                    <div onClick={toggleAddNewList} className="inside-project__new-list">
                        <img className="inside-project__plus" src={plus} alt="plus" />
                        <p className="inside-project__new-list-text">Add new list</p>
                    </div>
                )
                : (
                    <div className="inside-project__adding-new-list">
                        <input value={newListName} onChange={(e) => handleNewListName(e)} className="inside-project__new-list-input" type="text" placeholder="Enter list name..." autoComplete="off" />
                        <div className="inside-project__new-list-options">
                            <button onClick={() => { addList(); toggleAddNewList(); }} className="inside-project__new-list-button" type="button">Add List</button>
                            <img onClick={toggleAddNewList} className="inside-project__new-list-cross" src={cross} alt="cross" />
                        </div>
                    </div>
                )}
        </div>
    );
}
