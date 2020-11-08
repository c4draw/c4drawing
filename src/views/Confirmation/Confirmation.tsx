import './styles.css';

import { RoutesPath } from 'enums/routesPath';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cognito from 'services/cognito';

const Register = (props: any) => {
  const history = useHistory();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [email, setEmail] = useState("");
  const [isDisabledToConfirm, setIsDisabledToConfirm] = useState(true);

  function handleConfirmation(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    cognito.confirmRegistration(
      email,
      confirmationCode,
      handleConfirmationCallback
    );
    history.push(RoutesPath.Board);
  }

  function handleConfirmationCallback(error: any, result: any) {
    if (error) {
      console.log("❌ Error on confirmation:", JSON.stringify(error));
      alert(error.message);
      return;
    }
    console.log("✔️ Account confirmed with success: " + JSON.stringify(result));
    history.push(RoutesPath.Board);
  }

  const handleEmailOnChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handleConfirmationCodeOnChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    const confirmationCodeValue = event.currentTarget.value.trim();
    setConfirmationCode(confirmationCodeValue);
    const notAuthorizedToConfirm = confirmationCodeValue.length <= 0;
    setIsDisabledToConfirm(notAuthorizedToConfirm);
  };

  const setEmailOnInit = () => {
    const { location } = props;
    if (location?.state?.email) {
      setEmail(location.state.email);
    }
  };

  useEffect(setEmailOnInit, []);

  return (
    <div id="register" className="fade-in">
      <div className="wrapper">
        <nav>
          <div className="logo" aria-label="Ir para landing">
            <Link to={RoutesPath.Landing}>C4Drawing</Link>
          </div>
        </nav>

        <form onSubmit={handleConfirmation}>
          <h1>C4Drawing</h1>

          <label htmlFor="confirmation-email">e-mail para confirmação</label>

          <input
            id="confirmation-email"
            type="text"
            required={true}
            placeholder="e-mail"
            value={email}
            onChange={handleEmailOnChange}
          />

          <label htmlFor="confirmation-code">código de confirmação</label>

          <input
            id="confirmation-code"
            type="text"
            required={true}
            placeholder="000000"
            value={confirmationCode}
            onChange={handleConfirmationCodeOnChange}
          />

          <button type="submit" disabled={isDisabledToConfirm}>
            confirmar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
