import { ClientMetadata, CognitoUser, ISignUpResult, NodeCallback } from 'amazon-cognito-identity-js';

function register(
  _username: string,
  _password: string,
  _callback: NodeCallback<Error, ISignUpResult>,
  _clientMetadata?: ClientMetadata
): void {
  return;
}

function authenticate(
  _username: string,
  _password: string,
  _onSuccess: any,
  _onFailure: any
) {
  return;
}

function confirmRegistration(
  _email: string,
  _confirmationCode: string,
  _callback: NodeCallback<Error, ISignUpResult>
) {
  return;
}

function getLoggedUser(): CognitoUser | null {
  return null;
}

export default { register, authenticate, confirmRegistration, getLoggedUser };
