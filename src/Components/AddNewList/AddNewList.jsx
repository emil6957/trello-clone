/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import cross from "../../Images/x.svg";
import plus from "../../Images/plus.svg";
import "./AddNewList.css";

export default function AddNewList({
    newListName,
    handleNewListName,
    addList,
}) {
    const [addNewList, setAddNewList] = useState(false);

    function toggleAddNewList() {
        setAddNewList((prevBool) => !prevBool);
    }

    function submitList() {
        addList();
        toggleAddNewList();
    }

    function handleKeypress(e) {
        if (e.charCode === 13) {
            submitList();
        }
    }

    return (
        <div className="add-new-list">
            { addNewList
                ? (
                    <div className="add-new-list__active">
                        <input ref={(input) => input && input.focus()} value={newListName} onChange={(e) => handleNewListName(e)} onKeyPress={(e) => handleKeypress(e)} className="add-new-list__input" type="text" placeholder="Enter list name..." autoComplete="off" />
                        <div className="add-new-list__buttons">
                            <button onClick={() => { addList(); toggleAddNewList(); }} className="add-new-list__add-button" type="button">Add List</button>
                            <img onClick={toggleAddNewList} className="add-new-list__close-button" src={cross} alt="cross" />
                        </div>
                    </div>
                )
                : (
                    <div onClick={toggleAddNewList} className="add-new-list__inactive">
                        <img className="add-new-list__plus" src={plus} alt="plus" />
                        <p className="add-new-list__text">Add new list</p>
                    </div>
                )}
        </div>
    );
}
