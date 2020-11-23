import './styles.css';

import React from 'react';
import { BsArrowRepeat } from 'react-icons/bs';

const Loading = () => {
  const iconSize = 80;
  const iconColor = "#333";

  return (
    <div id="loading" className="fade-in">
      <div className="wrapper">
        <h2 data-testid="loading-title">Loading...</h2>

        <div className="rotate">
          <BsArrowRepeat color={iconColor} size={iconSize} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
