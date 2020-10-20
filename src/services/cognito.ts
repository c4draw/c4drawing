import {
  AuthenticationDetails,
  ClientMetadata,
  CognitoUser,
  CognitoUserAttribute,
  ISignUpResult,
  NodeCallback,
} from 'amazon-cognito-identity-js';
import cognitoUserPool from 'config/cognitoUserPool';

const userAttributes: CognitoUserAttribute[] = [];
const validationData: CognitoUserAttribute[] = [];

function Register(
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

function Authenticate(
  username: string,
  password: string,
  onSuccess: any,
  onFailure: any
) {
  const cognitoClient = new CognitoUser({
    Username: username,
    Pool: cognitoUserPool,
  });

  const authData = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  cognitoClient.authenticateUser(authData, { onSuccess, onFailure });
}

export default { Register, Authenticate };
