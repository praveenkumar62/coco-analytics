/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Table, { type IColumn } from "../components/table-v1";
import AddEditUser, { type IUser } from "../components/add-edit-user";
import { useNotyBlock } from "../context/NotyContext";
import DeleteIcon from "../assets/delete.png";
import EditIcon from "../assets/edit-pen.png";
import DeletePopup from "../components/delete-popup";

export default function UsersList() {
  const { handleNoty } = useNotyBlock();
  const [addUser, setAddUser] = useState<boolean>(false);
  const [usersData, setUsersData] = useState([]);
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<{
    id: number;
    username: string;
  } | null>(null);

  const columns: IColumn[] = [
    {
      accessor: "id",
      header: "ID",
    },
    {
      accessor: "name",
      header: "Name",
    },
    {
      accessor: "username",
      header: "Username",
    },
    {
      accessor: "phone",
      header: "Phone",
    },
    {
      accessor: "edit",
      header: "",
      cell: (row) => (
        <img
          src={EditIcon}
          alt="edit"
          width={24}
          height={24}
          style={{ cursor: "pointer" }}
          onClick={() => setEditUser(row)}
        />
      ),
    },
    {
      accessor: "delete",
      header: "",
      cell: (row) => (
        <img
          src={DeleteIcon}
          alt="delete"
          width={24}
          height={24}
          style={{ cursor: "pointer" }}
          onClick={() => setDeleteUser(row)}
        />
      ),
    },
  ];

  const getUsersList = () => {
    axios
      .get("/api/users/list")
      .then((res) => setUsersData(res?.data?.data))
      .catch((err) =>
        handleNoty(err?.message || "Error in fetching users", "error"),
      );
  };

  const handleDelete = () => {
    axios.delete(`/api/users/${deleteUser.id}`)
      .then((res) => handleNoty(res?.data?.message, 'success'))
      .catch((err) => handleNoty(err?.message, 'error'))
      .finally(() => {
        setDeleteUser(null);
        getUsersList();
      })
  }

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-4">Users List</h1>
        <button
          className="text-sm cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white mb-4 rounded-md"
          onClick={() => setAddUser(true)}
        >
          Add User +
        </button>
      </div>
      <Table columns={columns} rows={usersData} />
      {addUser && (
        <AddEditUser
          onClose={() => setAddUser(false)}
          onSuccess={() => {
            getUsersList();
            setAddUser(false);
          }}
        />
      )}
      {editUser && (
        <AddEditUser
          userDetails={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => {
            getUsersList();
            setEditUser(null);
          }}
        />
      )}
      {deleteUser && (
        <DeletePopup 
          title="user" 
          value={deleteUser?.username} 
          onCancel={() => setDeleteUser(null)} 
          onConfirm={() => handleDelete()}
        />
      )}
    </div>
  );
}
