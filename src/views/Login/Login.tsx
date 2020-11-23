import './styles.css';

import React, { SyntheticEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cognito from 'services/cognito';

import { RoutesPath } from '../../enums/routesPath';

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
  }

  const handleOnSuccesAuth = () => {
    history.push(RoutesPath.Board);
  };

  const handleOnErrorAuth = (err: any) => {
    const defaultMessage = "Something isn't woking, sorry. Try again later.";
    const { message = defaultMessage } = err;
    alert(message);
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
            data-testid="email-input"
            type="email"
            required={true}
            placeholder="e-mail"
            value={email}
            onChange={handleEmailOnChange}
          />

          <input
            data-testid="password-input"
            type="password"
            required={true}
            placeholder="senha"
            autoComplete="off"
            value={password}
            onChange={handlePasswordOnChange}
          />
          {/* 
          <Link to={RoutesPath.Board} className="forget-password">
            esqueci minha senha
          </Link> */}

          <div className="button-group">
            <button type="button" onClick={handleRegister}>
              registre-se
            </button>

            <button type="submit" data-testid="sign-in-btn">
              entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
