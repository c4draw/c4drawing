import React, { useState, useRef } from "react";
import "./styles.css";
import UserComponent from "./components/UserComponent";

function App() {
  const autoCursor = "auto-cursor";
  // const grabCursor = "grab-cursor";
  const grabbingCursor = "grabbing-cursor";

  const userElement = useRef({});
  const [mouseCursor, setMouseCursor] = useState("");
  const [isGrabbing, setIsGrabbing] = useState(false);

  function setAutoCursor() {
    setMouseCursor(autoCursor);
  }

  // function setGrabCursor() {
  //   // Should check if wants resize
  //   setMouseCursor(grabCursor);
  // }

  function setGrabbingCursor() {
    setMouseCursor(grabbingCursor);
  }

  function handleMouseDown(event) {
    setGrabbingCursor();
    setIsGrabbing(true);
  }

  function handleMouseUp(event) {
    // setGrabCursor();
    setIsGrabbing(false);
  }

  function handleMouseMove(event) {
    event.preventDefault();
    if (isGrabbing) {
    }
  }

  return (
    <div>
      <div className="grades">
        <div className="vertical" />
        <div className="horizontal" />
      </div>
      <div
        className={`board ${mouseCursor}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <UserComponent
          // setGrabCursor={setGrabCursor}
          setAutoCursor={setAutoCursor}
        />
      </div>
    </div>
  );
}

export default App;
