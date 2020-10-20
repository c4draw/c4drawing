import './styles.css';

import React from 'react';
import { Link } from 'react-router-dom';

import { RoutesPath } from '../../enums/routesPath';

const Landing = () => {
  return (
    <div id="landing" className="fade-in">
      <div className="wrapper">
        <nav>
          <div className="logo">
            <Link to={RoutesPath.Landing}>C4Drawing</Link>
          </div>
          <div className="links">
            <Link to={RoutesPath.Landing}>Login</Link>
            <Link to={RoutesPath.Landing} className="highlighted">
              Registre-se
            </Link>
          </div>
        </nav>

        <div className="content">
          <h1>C4Drawing</h1>
          <p>
            porque desenhos de arquitetura de software não precisam ser
            complicados.
          </p>
          <Link to={RoutesPath.Board}>
            <button>ir para o board</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
