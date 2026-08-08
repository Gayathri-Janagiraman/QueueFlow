import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";

const AuthModal = ({ isOpen, mode, setMode, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full text-2xl font-bold text-gray-500 hover:bg-gray-100 hover:text-black"
        >
          ×
        </button>

        {/* Login / Register */}
        {mode === "login" ? (
          <Login setMode={setMode} />
        ) : (
          <Register setMode={setMode} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;