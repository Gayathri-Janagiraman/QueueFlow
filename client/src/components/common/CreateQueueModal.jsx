import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const CreateQueueModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    averageServiceTime: "",
    prefix: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.description ||
    !formData.averageServiceTime ||
    !formData.prefix
  ) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const response = await api.post("/queues", {
      ...formData,
      averageServiceTime: Number(formData.averageServiceTime),
      prefix: formData.prefix.toUpperCase(),
    });

    toast.success(response.data.message);

    onSuccess();

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to create queue"
    );
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        <h2 className="mb-6 text-2xl font-bold text-secondary">
          Create New Queue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block font-medium">
              Queue Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-primary"
              placeholder="e.g. Cardiology"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-primary"
              placeholder="Queue description"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Average Service Time (mins)
            </label>

            <input
              type="number"
              name="averageServiceTime"
              value={formData.averageServiceTime}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-primary"
              placeholder="10"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Prefix
            </label>

            <input
              type="text"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 uppercase outline-none focus:border-primary"
              placeholder="C"
              maxLength={2}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:opacity-90"
            >
              Create Queue
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateQueueModal;