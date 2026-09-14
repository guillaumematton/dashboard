"use client";

import { AuthProvider, AuthContext } from "react-oauth2-code-pkce";
import { useState, useEffect, useContext } from "react";

function AuthenticatedUser() {
  const { token, login, logOut, tokenData } = useContext(AuthContext);

  if (!token) {
    return <button onClick={() => login()}>Log in with GitHub</button>;
  }

  return (
    <div>
      <p>Logged in!</p>
      <button onClick={() => logOut()}>Log out</button>
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const authConfig = {
    clientId: 'Ov23linRYUnTKdB5mtNX',
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: '/api/github',
    redirectUri: window.location.origin,
    scope: 'read:user user:email',
    decodeToken: false,
    loginMethod: 'popup',
  };

  return (
    <AuthProvider authConfig={authConfig}>
      <AuthenticatedUser />
    </AuthProvider>
  );
}