import './styles.css';

import React, { SyntheticEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { RoutesPath } from '../../enums/routesPath';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("✔️ Login with success!");
    history.push(RoutesPath.Board);
  }

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
            porque desenhos de arquitetura de software não precisam ser
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
