/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import "./NewProjectBackground.css";
import desert from "../../Images/desert.jpg";
import snow from "../../Images/snow.jpg";
import mountains from "../../Images/mountains.jpg";
import fields from "../../Images/fields.jpg";

export default function NewProjectBackground({ projectBackground, handleBackground }) {
    return (
        <div className="new-project-background">
            <div style={projectBackground} className="new-project__temp-div" />
            <div className="new-project__project-background">
                <h5 className="new-project__project-background-header">Project Background</h5>
                <div className="new-project__background-images">
                    <img onClick={() => handleBackground("img", desert)} src={desert} alt="background" className="new-project__temp-background" />
                    <img onClick={() => handleBackground("img", snow)} src={snow} alt="background" className="new-project__temp-background" />
                    <img onClick={() => handleBackground("img", mountains)} src={mountains} alt="background" className="new-project__temp-background" />
                    <img onClick={() => handleBackground("img", fields)} src={fields} alt="background" className="new-project__temp-background" />
                </div>
                <div className="new-project__background-colors">
                    <div onClick={() => handleBackground("color", "7392FF")} className="new-project__temp-background-color background-blue" />
                    <div onClick={() => handleBackground("color", "D49536")} className="new-project__temp-background-color background-orange" />
                    <div onClick={() => handleBackground("color", "DE4D56")} className="new-project__temp-background-color background-red" />
                    <div onClick={() => handleBackground("color", "5BB74C")} className="new-project__temp-background-color background-green" />
                    <div onClick={() => handleBackground("color", "C155AA")} className="new-project__temp-background-color background-pink" />
                    <div className="new-project__temp-background-color" />
                </div>
            </div>
        </div>
    );
}
