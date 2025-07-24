import axios from "axios";
import { useEffect, useReducer, type ChangeEvent } from "react";
import { useNotyBlock } from "../context/NotyContext";
import { useUserInfo } from "../context/UserContext";
import type { ICocoDetails } from "../pages/CocoList";

interface IProps { 
  editCocoDetails?: ICocoDetails;
  onClose: () => void;
  onSuccess: () => void;
}

const initialState = {
  pickDate: '',
  takenDate: '',
  newCount: 0,
  oldCount: 0,
  newCost: 0,
  oldCost: 0,
}

function productReducer(state, action) {
  switch (action.type) {
    case "SET_FIELDS": 
      return { ...state, [action.key]: action.value };
    case "PRE_FIELDS": 
      return { ...action.value };
    default:
      return state;
  }
}

export default function AddEditCoco({editCocoDetails, onClose, onSuccess}: IProps) {
  const [productDetails, productDispatch] = useReducer(productReducer, initialState);
  const { handleNoty } = useNotyBlock();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (editCocoDetails) {
      const details = {
        pickDate: editCocoDetails?.pickDate,
        takenDate: editCocoDetails?.takenDate,
        newCount: editCocoDetails?.newCount,
        oldCount: editCocoDetails?.oldCount,
        newCost: editCocoDetails?.newCost,
        oldCost: editCocoDetails?.oldCost,
      }
      productDispatch({ type: "PRE_FIELDS", value: details })
    }
  }, [editCocoDetails]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    productDispatch({
      type: "SET_FIELDS",
      key: e.target.id,
      value: e.target.value,
    })
  }

  const handleSave = () => {
    if (productDetails) {
      axios.put(`${import.meta.env.VITE_API_URL}/api/product/update/${editCocoDetails.id}`, productDetails) 
      .then((res) => {
        handleNoty(res?.data?.message, 'success');
          onSuccess();
        })
        .catch((err) => handleNoty(err.response.data.message, 'error'));
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/api/product/save/${userInfo.id}`, productDetails)
        .then((res) => {
          handleNoty(res?.data?.message, 'success');
          onSuccess();
        })
        .catch((err) => handleNoty(err.response.data.message, 'error'));
    }
  }
  
  return (
    <div className="bg-gray-700 fixed top-0 right-0 left-0 bottom-0 z-50 bg-opacity-60 backdrop-blur-sm transition-opacity flex justify-center items-center">
      <div className="bg-white relative z-60 rounded-md mx-4 w-full lg:w-[700px] p-4">
        <div className="flex justify-between items-center border-b border-gray-300 rounded-none pb-2 mb-6">
          <h4 className="text-lg font-bold">Add Coconut details</h4>
          <div className="bg-red-600 text-white py-1 px-3 rounded-lg text-sm cursor-pointer" onClick={() => onClose()}>X</div>
        </div>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="pickDate"
            >
              Coconut picking date
            </label>
            <input
              type="date"
              id="pickDate"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.pickDate}
            />
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="takenDate"
            >
              Coconut taken date
            </label>
            <input
              type="date"
              id="takenDate"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.takenDate}
            />
          </div>
        </section>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="newCount"
            >
              Coconut count (new)
            </label>
            <input
              type="number"
              id="newCount"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.newCount}
            />
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="oldCount"
            >
              Coconut count (old)
            </label>
            <input
              type="number"
              id="oldCount"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.oldCount}
            />
          </div>
        </section>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="newCost"
            >
              Coconut cost (new)
            </label>
            <input
              type="number"
              id="newCost"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.newCost}
            />
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="oldCost"
            >
              Coconut cost (old)
            </label>
            <input
              type="number"
              id="oldCost"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.oldCost}
            />
          </div>
        </section>
        <section className="flex justify-center">
          <button className="py-2 px-6 text-white bg-orange-400 rounded-md text-sm" onClick={handleSave}>Save</button>
        </section>
      </div>
    </div>
  );
}
