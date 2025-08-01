import axios from "axios";
import { useEffect, useReducer, useState, type ChangeEvent } from "react";
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
  const [error, setError] = useState({
    pickDate: '',
    takenDate: '',
    newCount: '',
    oldCount: '',
    newCost: '',
    oldCost: '',
  });
  const [showError, setShowError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    productDispatch({
      type: "SET_FIELDS",
      key: e.target.id,
      value: e.target.value,
    })
  }

  const handleSave = () => {
    const getErrorObj = getErr();
    const isNotValid = Object.values(getErrorObj).some((item) => item);

    if (isNotValid) {
      setShowError(true);
      return;
    }
    if (new Date(productDetails.takenDate) < new Date(productDetails.pickDate)) {
      handleNoty('Coconut picking date should not be greater coconut taken date', 'error');
      return;
    }
    if (editCocoDetails) {
      axios.put(`${import.meta.env.VITE_API_URL}/api/product/update/${editCocoDetails.id}`, productDetails) 
      .then((res) => {
        handleNoty(res?.data?.message, 'success');
          onSuccess();
        })
        .catch((err) => handleNoty(err.response.data.message, 'error'));
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/api/product/${userInfo.id}/save`, productDetails)
        .then((res) => {
          handleNoty(res?.data?.message, 'success');
          onSuccess();
        })
        .catch((err) => handleNoty(err.response.data.message, 'error'));
    }
  }

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

  const getErr = () => {
    const errObj = {
      pickDate: '',
      takenDate: '',
      newCount: '',
      oldCount: '',
      newCost: '',
      oldCost: '',
    };
    errObj.pickDate = productDetails?.pickDate?.length > 0 ? '' : 'Value is required';
    errObj.takenDate = productDetails?.takenDate?.length > 0 ? '' : 'Value is required';
    if (productDetails?.newCount === '') errObj.newCount = 'Value is required'; 
    else if (parseInt(productDetails?.newCount) < 0) errObj.newCount = 'Value should not be less than 0';
    else errObj.newCount = '';
    if (productDetails?.oldCount === '') errObj.oldCount = 'Value is required'; 
    else if (parseInt(productDetails?.oldCount) < 0) errObj.oldCount = 'Value should not be less than 0';
    else errObj.oldCount = '';
    if (productDetails?.newCost === '') errObj.newCost = 'Value is required'; 
    else if (parseInt(productDetails?.newCost) < 0) errObj.newCost = 'Value should not be less than 0';
    else errObj.newCost = '';
    if (productDetails?.oldCost === '') errObj.oldCost = 'Value is required'; 
    else if (parseInt(productDetails?.oldCost) < 0) errObj.oldCost = 'Value should not be less than 0';
    else errObj.oldCost = '';
    return errObj;
  }

  useEffect(() => {
    const err = getErr();
    setError(err);
  }, [productDetails]);

  console.log('error', error)
  
  return (
    <div className="bg-gray-700 fixed top-0 right-0 left-0 bottom-0 z-50 bg-opacity-60 backdrop-blur-sm transition-opacity flex justify-center items-center">
      <div className="bg-white relative z-60 rounded-md mx-4 w-full lg:w-[700px] p-4">
        <div className="flex justify-between items-center border-b border-gray-300 rounded-none pb-2 mb-6">
          <h4 className="text-lg font-bold">{editCocoDetails ? 'Edit' : 'Add'} Coconut details</h4>
          <div className="bg-red-600 text-white py-1 px-3 rounded-lg text-sm cursor-pointer" onClick={() => onClose()}>X</div>
        </div>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="pickDate"
            >
              Coconut Picking Date
            </label>
            <input
              type="date"
              id="pickDate"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.pickDate}
            />
            {showError && error?.pickDate && <div className="text-xs text-red-500">{error.pickDate}</div>}
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="takenDate"
            >
              Coconut Taken Date
            </label>
            <input
              type="date"
              id="takenDate"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.takenDate}
            />
            {showError && error?.takenDate && <div className="text-xs text-red-500">{error.takenDate}</div>}
          </div>
        </section>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="newCount"
            >
              Coconut Count (New)
            </label>
            <input
              type="number"
              id="newCount"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.newCount}
            />
            {showError && error?.newCount && <div className="text-xs text-red-500">{error.newCount}</div>}
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="oldCount"
            >
              Coconut Count (Old)
            </label>
            <input
              type="number"
              id="oldCount"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.oldCount}
            />
            {showError && error?.oldCount && <div className="text-xs text-red-500">{error.oldCount}</div>}
          </div>
        </section>
        <section className="block sm:flex gap-4">
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="newCost"
            >
              Per Coconut Cost (New)
            </label>
            <input
              type="number"
              id="newCost"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.newCost}
            />
            {showError && error?.newCost && <div className="text-xs text-red-500">{error.newCost}</div>}
          </div>
          <div className="w-full sm:w-1/2 pb-4">
            <label
              className="text-xs mb-2 block text-gray-700 font-medium"
              htmlFor="oldCost"
            >
              Per Coconut Cost (Old)
            </label>
            <input
              type="number"
              id="oldCost"
              className="px-2 border block h-10 w-full rounded-md"
              onChange={handleChange}
              value={productDetails?.oldCost}
            />
            {showError && error?.oldCost && <div className="text-xs text-red-500">{error.oldCost}</div>}
          </div>
        </section>
        <section className="flex justify-center">
          <button className="py-2 px-6 text-white bg-orange-400 rounded-md text-sm" onClick={handleSave}>Save</button>
        </section>
      </div>
    </div>
  );
}
