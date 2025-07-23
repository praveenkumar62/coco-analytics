interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  value?: string;
}

export default function DeletePopup({onCancel, onConfirm, title, value}: IProps) {
  return (
    <div className="bg-gray-700 fixed top-0 right-0 left-0 bottom-0 z-50 bg-opacity-60 backdrop-blur-sm transition-opacity flex justify-center items-center">
      <div className="bg-white relative z-60 rounded-md mx-4 w-full lg:w-[500px] p-4">
        <p className="text-sm text-center">
          Are you sure, do you want to delete this {
          title && (
            <>{title}&nbsp;
              <span className="font-semibold inline-block">
                {value}
              </span>
            </>
          )}
          ?
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="py-2 px-6 text-sm border border-gray-500 bg-white hover:opacity-65 text-gray-500 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="ml-2 py-2 px-6 text-sm border border-red-500 bg-red-500 hover:bg-red-400 text-white rounded-md"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}