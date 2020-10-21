import './styles.css';

import { RoutesPath } from 'enums/routesPath';
import React, { SyntheticEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cognito from 'services/cognito';

const Register = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // console.log("✔️ Register with success!");
    cognito.Register(email, password, handleRegisterCallback);
    // history.push(RoutesPath.Board);
  }

  function handleRegisterCallback(error: any, result: any) {
    if (error) {
      console.log("❌ Error on sign-up:", JSON.stringify(error));
      alert(error.message);
      return;
    }
    console.log("✔️ Sign-up with success: " + JSON.stringify(result));
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
            placeholder="username"
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
