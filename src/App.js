import React, { useState } from "react";
import "./styles.css";
import { useRef } from "react";

function App() {
  const userElement = useRef(null);
  const [mouseCursor, setMouseCursor] = useState("");

  function setAutoCursor() {
    setMouseCursor("auto-cursor");
  }

  function setGrabCursor() {
    // Should check if wants resize
    setMouseCursor("grab-cursor");
  }

  function setGrabbingCursor() {
    setMouseCursor("grabbing-cursor");
  }

  return (
    <div>
      <div className="board">
        {mouseCursor}
        <div className={`user ${mouseCursor}`} ref={userElement}>
          <div
            className="head"
            onMouseEnter={setGrabCursor}
            onMouseDown={setGrabbingCursor}
            onMouseUp={setGrabCursor}
            onMouseLeave={setAutoCursor}
          />
          <div
            className="body"
            onMouseEnter={setGrabCursor}
            onMouseDown={setGrabbingCursor}
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
