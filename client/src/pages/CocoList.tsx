import { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import Table, { type IColumn } from "../components/table-v1";
import AddEditCoco from "../components/add-edit-coco";
import { useNotyBlock } from "../context/NotyContext";
import { useUserInfo } from "../context/UserContext";

import EditIcon from '../assets/edit-pen.png';
import DeleteIcon from '../assets/delete.png';
import DeletePopup from "../components/delete-popup";
import { roundingOff } from "../components/utils";

export interface ICocoDetails {
  pickDate: string;
  takenDate: string;
  newCount: number;
  oldCount: number;
  newCost: number;
  oldCost: number;
  id?: string;
  userId?: string;
}

export default function CocoList() {
  const { handleNoty } = useNotyBlock();
  const { userInfo } = useUserInfo();
  const [productsData, setProductData] = useState([]);
  const [addCoco, setAddCoco] = useState(false);
  const [editCoco, setEditCoco] = useState<ICocoDetails | null>(null);
  const [deleteCocoId, setDeleteCocoId] = useState<string | null>(null);

  const columns: IColumn[] = [
    {
      accessor: "id",
      header: "ID",
    },
    {
      accessor: "coco_pick",
      header: "Coconut Pick",
      cell: (row) => {
        const { coco_pick } = row;
        return (
          <div>{DateTime.fromISO(coco_pick).toFormat('dd MMM yyyy')}</div>
        )
      }
    },
    {
      accessor: "coco_taken",
      header: "Coconut Taken",
      cell: (row) => {
        const { coco_taken } = row;
        return (
          <div>{DateTime.fromISO(coco_taken).toFormat('dd MMM yyyy')}</div>
        )
      }
    },
    {
      accessor: "old_coco",
      header: "Old Coconut",
    },
    {
      accessor: "old_coco_cost",
      header: "Old Coconut Cost",
      cell: (row) => {
        const { old_coco_cost, old_coco } = row;
        return (
        <div>
          {roundingOff(old_coco_cost * old_coco)}&nbsp; 
          {old_coco_cost > 0 && <span className="font-bold">({old_coco_cost}/p)</span>}
        </div>
      )}
    },
    {
      accessor: "new_coco",
      header: "New Coconut",
    },
    {
      accessor: "new_coco_cost",
      header: "New Coconut Cost",
      cell: (row) => {
        const { new_coco_cost, new_coco } = row;
        return (
        <div>
          {new_coco_cost * new_coco}&nbsp;
          {new_coco_cost > 0 && <span className="font-bold">({new_coco_cost}p)</span>}
        </div>
      )}
    },
    {
      accessor: "total_coco",
      header: "Total Coconut",
      cell: (row) => {
        const { old_coco, new_coco} = row;
        return (
          <div>{old_coco + new_coco}</div>
        )
      }
    },
    {
      accessor: "total_cost",
      header: "Total Cost",
      cell: (row) => {
        const { old_coco, old_coco_cost, new_coco, new_coco_cost} = row;
        return (
          <div>{(old_coco_cost * old_coco) + (new_coco_cost * new_coco)}</div>
        )
      }
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
          onClick={() => setEditCoco({
            pickDate: DateTime.fromISO(row.coco_pick).toFormat('yyyy-MM-dd'),
            takenDate: DateTime.fromISO(row.coco_taken).toFormat('yyyy-MM-dd'),
            newCount: row.new_coco,
            newCost: row.new_coco_cost,
            oldCount: row.old_coco,
            oldCost: row.old_coco_cost,
            id: row.id
          })}
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
          onClick={() => setDeleteCocoId(row?.id)}
        />
      ),
    },
  ];

  function getCocoList() {
    axios.get(`${import.meta.env.VITE_API_URL}/api/product/${userInfo.id}/list`)
      .then((res) => setProductData(res?.data?.data))
      .catch((err) => handleNoty(err?.response?.data?.message, 'error'))
  }

  useEffect(() => {
    getCocoList();
  }, []);

  const handleDelete = () => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/product/delete/${deleteCocoId}`)
      .then((res) => {
        handleNoty(res?.data?.message, 'success');
        getCocoList();
      })
      .catch((err) => handleNoty(err?.message, 'error'))
      .finally(() => {
        setDeleteCocoId(null);
        getCocoList();
      })
  }

  console.log(productsData)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-4">Coconut Information</h1>
        <button
          className="text-sm cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white mb-4 rounded-md"
          onClick={() => setAddCoco(true)}
        >
          Add New +
        </button>
      </div>
      <Table columns={columns} rows={productsData} />
      {addCoco && (
        <AddEditCoco 
          onClose={() => setAddCoco(false)} 
          onSuccess={() => {
            setAddCoco(false);
            getCocoList();
          }}
        />
      )}
      {editCoco && (
        <AddEditCoco 
          onClose={() => setEditCoco(null)} 
          onSuccess={() => {
            setEditCoco(null);
            getCocoList();
          }}
          editCocoDetails={editCoco}
        />
      )}
      { deleteCocoId && (
        <DeletePopup
          title="coconut ID"
          value={deleteCocoId}
          onCancel={() => setDeleteCocoId(null)}
          onConfirm={() => handleDelete()}
        />  
      )}
    </div>
  );
}
