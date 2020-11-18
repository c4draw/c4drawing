import "./styles.css";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { RoutesPath } from "../../enums/routesPath";
import cognito from "services/cognito";
import { CognitoUser } from "amazon-cognito-identity-js";

const Landing = () => {
  const [isLoggedUser, setLoggedUser] = useState<CognitoUser | null>(null);

  useEffect(() => handleOnInitLanding(), []);

  const handleOnInitLanding = () => {
    setLoggedUser(cognito.getLoggedUser());
  };

  return (
    <div id="landing" className="fade-in">
      <div className="wrapper">
        <nav>
          <div className="logo">
            <Link to={RoutesPath.Landing}>C4Drawing</Link>
          </div>
          {!isLoggedUser && (
            <div className="links">
              <Link to={RoutesPath.Login}>Login</Link>
              <Link to={RoutesPath.Register} className="highlighted">
                Registre-se
              </Link>
            </div>
          )}
        </nav>

        <div className="content">
          <h1>C4Drawing</h1>
          <p>
            Porque desenhos de arquitetura de software não precisam ser
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
