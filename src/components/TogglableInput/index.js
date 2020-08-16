import React, { useState, useRef } from "react";
import "./styles.css";

const TogglableInput = ({ Tag = "h3", text = "title", setText }) => {
  const inputElement = useRef(null);
  const [lastValue, setlastValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function handleOnChange(event) {
    setInputValue(event.target.value);
  }

  function handleOnInputToAvoidScrollWithDynamicHeight() {
    const element = inputElement.current;
    if (element) {
      element.style.height = "";
      element.style.height = Math.min(element.scrollHeight) + "px";
    }
  }

  function toggleInput() {
    if (showInput) {
      setShowInput(false);
      return;
    }

    setShowInput(true);
    setlastValue(text);
    setInputValue(text);
    setTimeout(() => {
      handleOnInputToAvoidScrollWithDynamicHeight();
      inputElement.current.focus();
    }, 100);
  }

  function clearAuxiliaryItems() {
    setlastValue("");
    setInputValue("");
  }

  function handleKeyDown(event) {
    const pressedKey = event.key;
    const allowedKeys = { Escape: "Escape", Enter: "Enter" };
    if (!Object.values(allowedKeys).includes(pressedKey)) return;

    clearAuxiliaryItems();
    toggleInput();

    switch (pressedKey) {
      case allowedKeys.Escape:
        setText(lastValue);

        break;
      case allowedKeys.Enter:
        setText(inputValue ? inputValue : "-");

        break;
      default:
        break;
    }
  }

  const input = (
    <textarea
      ref={inputElement}
      onKeyDown={handleKeyDown}
      value={inputValue}
      onChange={handleOnChange}
      onfocusOut={toggleInput}
      onInput={handleOnInputToAvoidScrollWithDynamicHeight}
    />
  );

  const textElement = <Tag onDoubleClick={toggleInput}>{text}</Tag>;

  return showInput ? input : textElement;
};

export default TogglableInput;
