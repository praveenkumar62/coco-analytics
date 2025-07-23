/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

function isTokenExpired(token: string) {
  try {
    const { exp }: { exp: number } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    return true; // If decode fails, treat as expired
  }
}

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('coco-auth');
      if (!raw) {
        setIsAuthorized(false);
        return;
      }

      const userInfo = JSON.parse(raw);
      if (!userInfo?.token || isTokenExpired(userInfo.token)) {
        localStorage.removeItem('coco-auth');
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    } catch (err) {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) return null; // Optional: show loading spinner here
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return <>{children}</>;
}