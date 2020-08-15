import React, { useState } from "react";
import "./styles.css";
import { useRef } from "react";

function App() {
  const autoCursor = "auto-cursor";
  const grabCursor = "grab-cursor";
  const grabbingCursor = "grabbing-cursor";
  // const userElement = useRef(null);
  const [mouseCursor, setMouseCursor] = useState("");

  function setAutoCursor() {
    setMouseCursor(autoCursor);
  }

  function setGrabCursor() {
    // Should check if wants resize
    setMouseCursor(grabCursor);
  }

  function setGrabbingCursor() {
    setMouseCursor(grabbingCursor);
  }

  function handleMouseDown(event) {
    setGrabbingCursor();
    console.log(event.clientX);
  }

  function handleMouseMove(event) {}

  const [positionX, setPositionX] = useState(150);
  const [positionY, setPositionY] = useState(50);

  return (
    <div>
      <input
        type="number"
        value={positionX}
        onChange={(e) => {
          console.log(e.target.value);
          setPositionX(e.target.value);
        }}
      />
      <input
        type="number"
        value={positionY}
        onChange={(e) => setPositionY(e.target.value)}
      />
      <div className="board">
        <div
          className={`user ${mouseCursor}`}
          // ref={userElement}
          style={{ left: `${positionX}px`, top: `${positionY}px` }}
        >
          <div
            className="head"
            onMouseEnter={setGrabCursor}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={setGrabCursor}
            onMouseLeave={setAutoCursor}
          />
          <div
            className="body"
            onMouseEnter={setGrabCursor}
            onMouseDown={handleMouseDown}
            onMouseUp={setGrabCursor}
            onMouseLeave={setAutoCursor}
          >
            <h3>Personal Banking Customer</h3>
            <span>[Person]</span>
            <p>A customer of the bank, with personal bank accounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
