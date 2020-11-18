import {
  AuthenticationDetails,
  ClientMetadata,
  CognitoUserAttribute,
  ISignUpResult,
  NodeCallback,
} from "amazon-cognito-identity-js";
import cognitoUserPool, { getCognitoClient } from "config/cognitoUserPool";

const userAttributes: CognitoUserAttribute[] = [];
const validationData: CognitoUserAttribute[] = [];

function register(
  username: string,
  password: string,
  callback: NodeCallback<Error, ISignUpResult>,
  clientMetadata?: ClientMetadata
): void {
  cognitoUserPool.signUp(
    username,
    password,
    userAttributes,
    validationData,
    callback,
    clientMetadata
  );
}

function authenticate(
  username: string,
  password: string,
  onSuccess: any,
  onFailure: any
) {
  const cognitoClient = getCognitoClient(username);

  const authData = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  cognitoClient.authenticateUser(authData, { onSuccess, onFailure });
}

function confirmRegistration(
  email: string,
  confirmationCode: string,
  callback: NodeCallback<Error, ISignUpResult>
) {
  const cognitoClient = getCognitoClient(email);

  const forceAliasCreation = true;
  cognitoClient.confirmRegistration(
    confirmationCode,
    forceAliasCreation,
    callback
  );
}

function getLoggedUser() {
  return cognitoUserPool.getCurrentUser();
}

export default { register, authenticate, confirmRegistration, getLoggedUser };
