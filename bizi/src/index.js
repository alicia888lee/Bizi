import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify, { API, Auth, Storage } from 'aws-amplify';
import awsExports from "./aws-exports";
import * as queries from './graphql/queries';

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const isWWW = Boolean(window.location.hostname.includes('www'));

const [
  localRedirectSignIn,
  productionRedirectSignIn,
  productionRedirectSignInWWW,
] = awsExports.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
  productionRedirectSignOutWWW,
] = awsExports.oauth.redirectSignOut.split(",");

var redirectSignIn = null;
var redirectSignOut = null;
if (!isLocalhost) {
  if (isWWW) {
    redirectSignIn = productionRedirectSignInWWW;
    redirectSignOut = productionRedirectSignOutWWW;
  }
  else {
    redirectSignIn = productionRedirectSignIn;
    redirectSignOut = productionRedirectSignOut;
  }
}
else {
  redirectSignIn = localRedirectSignIn;
  redirectSignOut = localRedirectSignOut;
}

const updatedAwsExports = {
  ...awsExports,
  oauth: {
    ...awsExports.oauth,
    redirectSignIn: redirectSignIn,
    redirectSignOut: redirectSignOut,
  }
}
if (!isLocalhost) {
  console.log = function() {};
}

// Amplify.configure(updatedAwsExports);
Auth.configure(updatedAwsExports);
API.configure(updatedAwsExports);
Storage.configure(updatedAwsExports);

const getCredentials = async() => {
  try {
    var creds = await API.graphql({
      query: queries.getCredentials,
      variables: {id: 1}
    });
    return creds;
  }
  catch (error) {
    console.log(error);
  }
}

export const credentialsPromise = getCredentials();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
