import React from 'react';

interface IAbsoluteContainer {
  position: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

const AbsoluteContainer: React.FC<IAbsoluteContainer> = ({
  position,
  children,
}) => {
  return (
    <div
      style={{
        zIndex: 1,
        position: "absolute",
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom,
      }}
    >
      {children}
    </div>
  );
};

export default AbsoluteContainer;
