import React from 'react';

const InputTextModal = ({ hideModal }: { hideModal: () => void }) => {
  function handleCancelClick() {
    hideModal();
  }

  return (
    <div
      style={{
        background: "#ffffff8c",
        height: "100vh",
        width: "100vw",
        cursor: "not-allowed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        action=""
        style={{
          cursor: "default",
          background: "#0074a2a6",
          width: 350,
          padding: 25,
          borderRadius: 10,
        }}
      >
        <input type="text" style={{ width: 300 }} placeholder="Titulo" />
        <input type="text" style={{ width: 300 }} placeholder="Subtitulo" />
        <textarea
          name=""
          id=""
          placeholder="Descrição"
          style={{
            width: 300,
            resize: "vertical",
            maxHeight: 160,
            minHeight: 30,
          }}
        />
        <button type="button" onClick={handleCancelClick}>
          Cancelar
        </button>
        <button type="submit">Ok</button>
      </form>
    </div>
  );
};

export default InputTextModal;
