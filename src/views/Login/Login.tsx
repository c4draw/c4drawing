import "./styles.css";

import { ICognitoUserSessionData } from "amazon-cognito-identity-js";
import React, { SyntheticEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import cognito from "services/cognito";

import { RoutesPath } from "../../enums/routesPath";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    cognito.authenticate(
      email,
      password,
      handleOnSuccesAuth,
      handleOnErrorAuth
    );

    // history.push(RoutesPath.Board);
  }

  const handleOnSuccesAuth = (session: ICognitoUserSessionData) => {
    console.log("✔️ Login with success: ", JSON.stringify(session));
  };

  const handleOnErrorAuth = (err: any) => {
    console.log("❌  Error on login: ", JSON.stringify(err));
  };

  const handleRegister = () => {
    history.push(RoutesPath.Register);
  };

  const handleEmailOnChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordOnChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <div id="login" className="fade-in">
      <div className="wrapper">
        <nav>
          <div className="logo" aria-label="Ir para landing">
            <Link to={RoutesPath.Landing}>C4Drawing</Link>
          </div>
        </nav>

        <form onSubmit={handleLogin}>
          <h1>C4Drawing</h1>
          <p>
            Porque desenhos de arquitetura de software não precisam ser
            complicados.
          </p>
          <input
            type="email"
            required={true}
            placeholder="e-mail"
            value={email}
            onChange={handleEmailOnChange}
          />

          <input
            type="password"
            required={true}
            placeholder="senha"
            autoComplete="off"
            value={password}
            onChange={handlePasswordOnChange}
          />

          <Link to={RoutesPath.Board} className="forget-password">
            esqueci minha senha
          </Link>

          <div className="button-group">
            <button type="button" onClick={handleRegister}>
              registre-se
            </button>
            <button type="submit">entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
