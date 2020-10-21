import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

const defaultPoolDataValue = "unset";

const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID || defaultPoolDataValue,
  ClientId: process.env.REACT_APP_CLIENT_ID || defaultPoolDataValue,
};

const cognitoUserPool = new CognitoUserPool(poolData);

function getCognitoClient(email: string) {
  return new CognitoUser({
    Username: email,
    Pool: cognitoUserPool,
  });
}

export default cognitoUserPool;
export { getCognitoClient };
