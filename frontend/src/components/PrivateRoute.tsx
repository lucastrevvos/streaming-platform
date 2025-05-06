import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PrivateRoute() {
  const [isAuth, setIsAuth] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) {
    return <div>Carregando...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}
