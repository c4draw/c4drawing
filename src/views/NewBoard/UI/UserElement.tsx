import React from 'react';
import { Circle, Rect } from 'react-konva';

import { ColorPalete } from '../Enums/ColorPallete';
import { IElementProps } from '../Interfaces/ElementProps';
import EditableTextElement from './EditableTextElement';
import GroupElement from './GroupElement';

const UserElement: React.FC<IElementProps> = ({
  position,
  cursor,
  setCursor,
  showTextInput,
}) => {
  return (
    <GroupElement
      cursor={cursor}
      setCursor={setCursor}
      props={{ x: position?.x, y: position?.y, draggable: true }}
    >
      <Circle x={125} radius={40} fill={ColorPalete.User} />
      <Rect
        y={30}
        width={250}
        height={150}
        cornerRadius={10}
        fill={ColorPalete.User}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontStyle: "bold",
          fontSize: 20,
          y: 40,
          width: 250,
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
          y: 40 + 30,
          width: 250,
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
          y: 40 + 50,
          width: 250,
          fill: ColorPalete.Text,
          text: "This is a secondary text to show how this element works.",
        }}
      />
    </GroupElement>
  );
};

export default UserElement;
