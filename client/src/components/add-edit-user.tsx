import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useNotyBlock } from "../context/NotyContext";

export interface IUser {
  id?: number;
  name: string;
  username: string;
  password?: string;
  phone: string;
}
interface IProps {
  userDetails?: IUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialState = {
  name: "",
  username: "",
  oldPassword: "",
  newPassword: "",
  phone: "",
};

function userReducer(state, action) {
  switch (action.type) {
    case "SET_FIELDS":
      return { ...state, [action.key]: action.value };
    case "CLEAR_FIELDS":
      return initialState;
    case "PRE_FIELDS":
      return action.value;
    default:
      return state;
  }
}

export default function AddEditUser({
  onClose,
  onSuccess,
  userDetails,
}: IProps) {
  const { handleNoty } = useNotyBlock();

  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [user, userDispatch] = useReducer(userReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userDispatch({
      type: "SET_FIELDS",
      key: e.target.id,
      value: e.target.value,
    });
  };

  const handleSave = () => {
    if (!userDetails)
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          name: user.name,
          username: user.username,
          phone: user.phone,
          password: user.newPassword,
        })
        .then((res) => {
          userDispatch({ type: "CLEAR_FIELDS" });
          onSuccess();
          handleNoty(res.data.message, "success");
        })
        .catch((res) => {
          handleNoty(res.response.data.message, "error");
        });
    else 
      axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${userDetails.id}`, {
        name: user.name,
        username: user.username,
        phone: user.phone,
        ...(changePassword && { oldPassword: user?.oldPassword }),
        ...(changePassword && { newPassword: user?.newPassword }),
      })
        .then((res) => {
          onSuccess();
          handleNoty(res.data.message, "success");
        })
        .catch((res) => {
          handleNoty(res.response.data.message, "error");
        });
  };

  useEffect(() => {
    if (userDetails) {
      const details = {
        name: userDetails?.name,
        username: userDetails?.username,
        newPassword: "",
        phone: userDetails?.phone,
      };
      userDispatch({ type: "PRE_FIELDS", value: details });
    }
  }, [userDetails]);

  return (
    <div className="bg-gray-700 fixed top-0 right-0 left-0 bottom-0 z-50 bg-opacity-60 backdrop-blur-sm transition-opacity flex justify-center items-center">
      <div className="bg-white relative z-60 rounded-md mx-4 w-full lg:w-[700px] p-4">
        <div className="flex justify-between items-center border-b border-gray-300 rounded-none pb-2 mb-6">
          <h4 className="text-lg font-bold">
            {userDetails ? "Edit" : "Add"} User Details
          </h4>
          <div
            className="bg-red-600 text-white py-1 px-3 rounded-lg text-sm cursor-pointer"
            onClick={() => onClose()}
          >
            X
          </div>
        </div>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="px-2 border block h-10 w-full rounded-md"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="username"
            >
              Username / Email
            </label>
            <input
              type="email"
              id="username"
              className="px-2 border block h-10 w-full rounded-md"
              value={user.username}
              onChange={handleChange}
            />
          </div>
        </section>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              className="px-2 border block h-10 w-full rounded-md"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            {userDetails ? (
              <div className="text-sm mt-9">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                />&nbsp;
                Do you want to change password?
              </div>
            ) : (
              <>
                <label
                  className="text-xs mb-2 block text-gray-700 font-medium"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="px-2 border block h-10 w-full rounded-md"
                  value={user.newPassword}
                  onChange={handleChange}
                />
              </>
            )}
          </div>
        </section>
        { userDetails && changePassword && (
          <section className="block sm:flex gap-4">
            <div className="w-full sm:w-1/2 pb-4">
              <label
                className="text-xs mb-2 block text-gray-700 font-medium"
                htmlFor="oldPassword"
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                className="px-2 border block h-10 w-full rounded-md"
                value={user?.oldPassword}
                onChange={handleChange}
              />
            </div>
            <div className="w-full sm:w-1/2 pb-4">
              <label
                className="text-xs mb-2 block text-gray-700 font-medium"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="px-2 border block h-10 w-full rounded-md"
                value={user?.newPassword}
                onChange={handleChange}
              />
            </div>
          </section>
        )}
        <section className="flex justify-center">
          <button
            className="py-2 px-6 text-white bg-orange-400 rounded-md text-sm"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </div>
    </div>
  );
}
