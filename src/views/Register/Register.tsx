import './styles.css';

import React, { SyntheticEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { RoutesPath } from '../../enums/routesPath';

const Register = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("✔️ Register with success!");
    history.push(RoutesPath.Board);
  }

  const handleReturnToLogin = (event: SyntheticEvent) => {
    history.push(RoutesPath.Login);
  };

  const handleEmailOnChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordOnChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <div id="register" className="fade-in">
      <div className="wrapper">
        <nav>
          <div className="logo" aria-label="Ir para landing">
            <Link to={RoutesPath.Landing}>C4Drawing</Link>
          </div>
        </nav>

        <form onSubmit={handleRegister}>
          <h1>C4Drawing</h1>
          <p>
            Após o cadastro você será redirecionado para o seu painel de boards
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

          <div className="button-group">
            <button type="button" onClick={handleReturnToLogin}>
              voltar
            </button>
            <button type="submit">register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
