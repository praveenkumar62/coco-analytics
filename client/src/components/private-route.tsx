import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { ReactNode } from "react";

function isTokenExpired(token: string) {
    const { exp } : {exp: number} = jwtDecode(token);
    console.log('exp', new Date(exp * 1000))
    return Date.now() >= exp * 1000; 
}

export default function PrivateRoute({children}: {children: ReactNode}) {
    const userInfo = JSON.parse(localStorage.getItem('coco-auth'));

    if (!userInfo?.token) {
        return <Navigate to='/login' />;
    } else if (isTokenExpired(userInfo.token)) {
        localStorage.removeItem('coco-auth');
        return <Navigate to='/login' />
    }
    return children;
}