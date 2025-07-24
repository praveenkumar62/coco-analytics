import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AuthRedirect() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("coco-auth");

    if (!raw) {
      setRedirectTo("/login");
      return;
    }

    try {
      const data = JSON.parse(raw);
      if (data?.token) {
        setRedirectTo("/dashboard");
      } else {
        setRedirectTo("/login");
      }
    } catch {
      setRedirectTo("/login");
    }
  }, []);

  if (redirectTo === null) return null; // Or show a loader
  return <Navigate to={redirectTo} replace />;
}