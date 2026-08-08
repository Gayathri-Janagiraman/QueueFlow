import { useEffect, useState } from "react";
import api from "../../services/api";
import socket from "../../socket/socket";
import toast from "react-hot-toast";
import CreateQueueModal from "../../components/common/CreateQueueModal";
import Navbar from "../../components/common/Navbar";

const AdminDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchQueues();

    socket.on("queueUpdated", (data) => {
      console.log("Queue Updated:", data);

      fetchQueues();

      if (
        selectedQueue &&
        data.queueId === selectedQueue._id
      ) {
        fetchQueueTokens(selectedQueue._id);
      }
    });

    return () => {
      socket.off("queueUpdated");
    };
  }, [selectedQueue]);

  const fetchQueues = async () => {
    try {
      const response = await api.get("/queues");
      setQueues(response.data.queues || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load queues");
    }
  };

  const fetchQueueTokens = async (queueId) => {
    try {
      const response = await api.get(`/tokens/queue/${queueId}`);
      setTokens(response.data.tokens || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load queues tokens");
    }
  };

  // -------------------- Serve Next --------------------

  const handleServeNext = async () => {
    if (!selectedQueue) return;

    try {
      const response = await api.patch("/tokens/serve-next", {
        queueId: selectedQueue._id,
      });

      toast.success(response.data.message);

      await fetchQueues();
      await fetchQueueTokens(selectedQueue._id);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to serve next token");
    }
  };

  // -------------------- Complete --------------------

  const handleCompleteToken = async () => {
    const servingToken = tokens.find(
      (token) => token.status === "serving"
    );

    if (!servingToken) {
      toast.error("No token is currently being served.");
      return;
    }

    try {
      const response = await api.patch("/tokens/complete", {
        tokenId: servingToken._id,
      });

      toast.success(response.data.message);

      await fetchQueues();
      await fetchQueueTokens(selectedQueue._id);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete token");
    }
  };

  // -------------------- Skip --------------------

  const handleSkipToken = async () => {
    const servingToken = tokens.find(
      (token) => token.status === "serving"
    );

    console.log("Serving Token:", servingToken);

    if (!servingToken) {
      toast.error("No token is currently being served.");
      return;
    }

    try {
      const response = await api.patch("/tokens/skip", {
        tokenId: servingToken._id,
      });

      toast.success(response.data.message);

      await fetchQueues();
      await fetchQueueTokens(selectedQueue._id);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to skip token");
    }
  };

  // -------------------- Recall --------------------

  const handleRecallToken = async (token) => {
    try {
      const response = await api.patch("/tokens/recall", {
        tokenId: token._id,
      });

      toast.success(response.data.message);

      await fetchQueues();
      await fetchQueueTokens(selectedQueue._id);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to recall token");
    }
  };


  const handleServeRecalled = async () => {
    try {
      const response = await api.patch("/tokens/serve-recalled", {
        queueId: selectedQueue._id,
      });

      toast.success(response.data.message);

      fetchQueueTokens(selectedQueue._id);
      fetchQueues();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to serve recalled token"
      );
    }
  };

  const handleAdminCancelToken = async (token) => {
    try {

      const res = await api.patch("/tokens/cancel-admin", {
        tokenId: token._id,
      });

      toast.success(res.data.message);

      fetchQueueTokens(selectedQueue._id);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to cancel token"
      );

    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-4 sm:p-8">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h1 className="text-2xl font-bold text-secondary sm:text-4xl">
            Admin Dashboard
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="w-fit rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            + Add Queue
          </button>
        </div>

        {/* Queue Cards */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {queues.map((queue) => (
            <button
              key={queue._id}
              onClick={() => {
                setSelectedQueue(queue);
                fetchQueueTokens(queue._id);
              }}
              className="rounded-xl border bg-white p-6 text-left shadow transition hover:border-primary hover:shadow-lg"
            >
              <h2 className="text-xl font-bold text-secondary">
                {queue.name}
              </h2>

              <p className="mt-2 text-gray-500">
                {queue.description}
              </p>

              <p className="mt-4 font-semibold text-primary">
                Current Token : {queue.currentTokenNumber}
              </p>
            </button>
          ))}

        </div>

        {/* Selected Queue */}

        {selectedQueue && (
          <div className="mt-10 rounded-xl bg-white p-4 shadow sm:p-6">

            <h2 className="text-2xl font-bold text-secondary">
              {selectedQueue.name}
            </h2>

            <p className="mt-6 mb-4 text-lg font-semibold">
              Active Tokens
            </p>

            {tokens.length === 0 ? (
              <p className="text-gray-500">
                No active tokens.
              </p>
            ) : (
              <div className="space-y-3">

                {tokens.map((token) => (
                  <div
                    key={token._id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
                  >

                    <div>
                      <h3 className="font-bold text-secondary">
                        {token.tokenNumber}
                      </h3>

                      <p className="text-gray-500">
                        {token.user?.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold
  ${token.status === "serving"
                            ? "bg-green-100 text-green-700"
                            : token.status === "waiting"
                              ? "bg-yellow-100 text-yellow-700"
                              : token.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : token.status === "skipped"
                                  ? "bg-red-100 text-red-700"
                                  : token.status === "recalled"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {token.status.toUpperCase()}
                      </span>

                      {(token.status === "waiting" ||
                        token.status === "recalled") && (
                          <button
                            onClick={() => handleAdminCancelToken(token)}
                            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}

                      {token.status === "skipped" && (
                        <button
                          onClick={() => handleRecallToken(token)}
                          className="rounded bg-accent px-4 py-2 text-white hover:opacity-90"
                        >
                          Recall
                        </button>
                      )}

                    </div>

                  </div>
                ))}

              </div>
            )}

            {/* Action Buttons */}

            <div className="mt-8 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap">

              <button
                onClick={handleServeNext}
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90"
              >
                Serve Next
              </button>

              <button
                onClick={handleCompleteToken}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                Complete Token
              </button>

              <button
                onClick={handleSkipToken}
                className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white hover:bg-yellow-600"
              >
                Skip Token
              </button>

              <button
                onClick={handleServeRecalled}
                className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Serve Recalled
              </button>

            </div>

          </div>
        )}
        {showModal && (
          <CreateQueueModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              fetchQueues();
              setShowModal(false);
            }}
          />
        )}

      </div>
    </>
  );
};

export default AdminDashboard;