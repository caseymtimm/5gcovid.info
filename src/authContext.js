import React, { useEffect, useState } from "react";
export const AuthContext = React.createContext();

export default ({ children }) => {
  const prevAuth =
    JSON.parse(window.localStorage.getItem("authenticated")) || false;
  const prevAuthBody =
    JSON.parse(window.localStorage.getItem("authBody")) || null;
  const [authenticated, setAuthenticated] = useState(prevAuth);
  const [authBody, setAuthBody] = useState(prevAuthBody);
  useEffect(() => {
    window.localStorage.setItem("authenticated", JSON.stringify(authenticated));
    window.localStorage.setItem("authBody", JSON.stringify(authBody));
  }, [authenticated, authBody]);
  const defaultContext = {
    authenticated,
    setAuthenticated,
    authBody,
    setAuthBody,
  };
  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  );
};
