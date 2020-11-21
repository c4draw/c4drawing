import React from 'react';

import { ToolsEnum } from '../Enums/ToolsEnum';

interface IToolBoxProps {
  tool: ToolsEnum;
  setTool: React.Dispatch<React.SetStateAction<ToolsEnum>>;
}

const ToolBox = ({ tool, setTool }: IToolBoxProps) => {
  return (
    <div>
      <button
        onClick={() => {
          setTool(ToolsEnum.None);
        }}
      >
        Pointer
      </button>
      <button
        onClick={() => {
          setTool(ToolsEnum.User);
        }}
      >
        Actor
      </button>
      <button
        onClick={() => {
          setTool(ToolsEnum.Principal);
        }}
      >
        Primary
      </button>
      <button
        onClick={() => {
          setTool(ToolsEnum.Support);
        }}
      >
        Support
      </button>
      <button
        onClick={() => {
          setTool(ToolsEnum.Interaction);
        }}
      >
        Interaction
      </button>
    </div>
  );
};

export default ToolBox;
