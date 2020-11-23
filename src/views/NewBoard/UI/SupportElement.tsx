import React from 'react';
import { Rect } from 'react-konva';

import { ColorPalete } from '../Enums/ColorPallete';
import { IElementProps } from '../Interfaces/ElementProps';
import EditableTextElement from './EditableTextElement';
import GroupElement from './GroupElement';

const SupportElement: React.FC<IElementProps> = ({
  cursor,
  position,
  setCursor,
  showTextInput,
}) => {
  return (
    <GroupElement
      cursor={cursor}
      setCursor={setCursor}
      props={{ x: position?.x, y: position?.y, draggable: true }}
    >
      <Rect
        height={175}
        width={300}
        fill={ColorPalete.Support}
        cornerRadius={10}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontStyle: "bold",
          fontSize: 20,
          y: 30,
          width: 300,
          fill: ColorPalete.Text,
          text: "Title text",
        }}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontSize: 16,
          y: 30 + 30,
          width: 300,
          fill: ColorPalete.Text,
          text: "[Tipo de Ator]",
        }}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontSize: 16,
          y: 30 + 50,
          width: 300,
          fill: ColorPalete.Text,
          text: "This is a secondary text to show how this element works.",
        }}
      />
    </GroupElement>
  );
};

export default SupportElement;
