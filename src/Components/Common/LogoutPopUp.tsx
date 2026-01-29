import toast from "react-hot-toast";

type LogoutToastProps = {
  onConfirm: () => void;
};

export const showLogoutToast = ({ onConfirm }: LogoutToastProps) => {
  toast.custom((t) => (
    <div
      className={`
        bg-white shadow-md rounded-lg p-3
        flex items-center justify-between gap-3
        w-full max-w-xs sm:max-w-sm
        ${t.visible ? "animate-enter" : "animate-leave"}
        `}
    >
      <span className="text-sm text-gray-700">Are you sure you want to logout?</span>

      <div className="flex gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
          className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  ));
};
