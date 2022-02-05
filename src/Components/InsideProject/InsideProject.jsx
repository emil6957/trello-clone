import React from "react";
import "./InsideProject.css";

export default function InsideProject({ name, background }) {
    return (
        <div styles={{ background }} className="inside-project">
            <div className="inside-project__new-list" />
        </div>
    );
}
