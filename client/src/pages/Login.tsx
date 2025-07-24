import { useState } from 'react';
import { useNotyBlock } from '../context/NotyContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { handleNoty } = useNotyBlock();
  const { setUserInfo } = useUserInfo();
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
  });

  const handleLogin = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/auth/login`, userDetails)
      .then((res) => {
        if (res?.data?.token) {
          const info = {
            token: res.data?.token,
            id: res.data?.id,
            name: res.data?.name,
            email: res.data?.username,
          }
          setUserInfo(info);
          localStorage.setItem('coco-auth', JSON.stringify(info));
          navigate('/dashboard');
        } else {
          handleNoty('Login failed', 'error');
        }
      })
      .catch((err) => {
        handleNoty(err?.response?.data?.message, 'error');
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="w-full py-12">
      <div className="w-96 shadow-xl bg-gray-50 rounded-md p-4 mx-auto">
        <div className="mb-4">
          <label htmlFor="username" className="text-xs block mb-1 text-gray-500">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter Email"
            className="w-full block border border-gray-200 rounded-md p-2 text-sm"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-xs block mb-1 text-gray-500">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            className="w-full block border border-gray-200 rounded-md p-2 text-sm"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button
          className="py-2 px-6 text-sm bg-blue-500 hover:bg-blue-400 text-white rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
