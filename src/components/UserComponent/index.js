import React, { useState } from "react";
import Draggable from "react-draggable";
import "./styles.css";
import TogglableInput from "../TogglableInput";

const UserComponent = ({ setGrabCursor, setAutoCursor }) => {
  const [showInputTitle, setShowInputTitle] = useState(false);
  const [lastValue, setlastValue] = useState("");
  const [title, setTitle] = useState("Personal Banking Customer");
  const [showInputSubtitle, setShowInputSubtitle] = useState(showInputTitle);
  const [subtitle, setSubtitle] = useState("[Person]");
  const [showInputDesc, setShowInputDesc] = useState(showInputTitle);
  const [description, setDescription] = useState(
    "A customer of the bank, with personal bank accounts."
  );

  function toggleTitleInput() {
    setlastValue(title);
    setShowInputTitle(!showInputTitle);
  }
  function toggleSubtitleInput() {
    setlastValue(subtitle);
    setShowInputSubtitle(!showInputSubtitle);
  }
  function toggleDescInput() {
    setlastValue(description);
    setShowInputDesc(!showInputDesc);
  }
  function handleKeyDown(event) {
    console.log(event.key);
    const pressedKey = event.key;
    const allowedKeys = ["Escape", "Enter"];
    if (allowedKeys.includes(pressedKey)) {
      toggleTitleInput();
      if (pressedKey === "Escape") setTitle(lastValue);
    }
  }

  return (
    <Draggable
      // grid={[25, 25]}
      grid={[10, 10]}
      cancel="textarea"
      handle={[".body", ".head"]}
      defaultPosition={{ x: 350, y: 100 }}
    >
      <div className="user">
        <div
          className="head"
          onMouseEnter={setGrabCursor}
          onMouseLeave={setAutoCursor}
        />
        <div
          className="body"
          onMouseEnter={setGrabCursor}
          onMouseLeave={setAutoCursor}
        >
          <TogglableInput text={title} setText={setTitle} Tag="h3" />
          <TogglableInput text={subtitle} setText={setSubtitle} Tag="span" />
          <TogglableInput text={description} setText={setDescription} Tag="p" />
        </div>
      </div>
    </Draggable>
  );
};

export default UserComponent;
