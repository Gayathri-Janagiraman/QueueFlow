// import { useEffect, useState } from "react";


// import { useNavigate } from "react-router-dom";

// import api from "../../services/api";
// import Button from "../../components/common/Button";
// import socket from "../../socket/socket";
// import toast from "react-hot-toast";
// import ConfirmModal from "../../components/common/ConfirmModal";
// import Navbar from "../../components/common/Navbar";

// const MyToken = () => {
//   const navigate = useNavigate();

//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showCancelModal, setShowCancelModal] = useState(false);

//   const fetchMyToken = async () => {
//     try {
//       const response = await api.get("/tokens/my-token");
//       setToken(response.data.token);
//     } catch (error) {
//       console.error(error);

//       if (error.response?.status === 404) {
//         setToken(null);
//       } else {
//         alert("Failed to load token");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleCancelToken = async () => {
//     try {
//       const response = await api.patch("/tokens/cancel", {
//         tokenId: token._id,
//       });

//       toast.success(response.data.message);

//       navigate("/user/dashboard");

//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//         "Failed to cancel token"
//       );
//     }
//   };

//   useEffect(() => {
//     fetchMyToken();

//     socket.on("queueUpdated", () => {
//       fetchMyToken();
//     });

//     return () => {
//       socket.off("queueUpdated");
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <h2 className="text-xl font-semibold text-secondary">
//           Loading...
//         </h2>
//       </div>
//     );
//   }

//   if (!token) {
//     return (
//       <>
//         <Navbar />

//         <div className="flex min-h-screen items-center justify-center bg-background">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold text-secondary">
//               No Active Token
//             </h2>

//             <Button
//               className="mt-6"
//               onClick={() => navigate("/user/dashboard")}
//             >
//               Back to Dashboard
//             </Button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const bookedDate = new Date(token.bookedAt);

//   const formattedDate = bookedDate.toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });

//   const formattedTime = bookedDate.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   const statusConfig = {
//     waiting: {
//       icon: "🟡",
//       className: "bg-yellow-100 text-yellow-700",
//     },
//     serving: {
//       icon: "🔵",
//       className: "bg-blue-100 text-blue-700",
//     },
//     completed: {
//       icon: "🟢",
//       className: "bg-green-100 text-green-700",
//     },
//     cancelled: {
//       icon: "🔴",
//       className: "bg-red-100 text-red-700",
//     },
//   };

//   const status =
//     statusConfig[token.status] || statusConfig.cancelled;

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-background flex items-center justify-center p-6">
//       <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">

//         <h1 className="mb-8 text-center text-4xl font-bold text-secondary">
//           Your Token
//         </h1>

//         {/* Queue & Status */}
//         <div className="grid grid-cols-2 gap-6">

//           <div>
//             <p className="text-gray-500">Queue</p>
//             <h2 className="text-xl font-semibold">
//               {token.queue.name}
//             </h2>
//           </div>

//           <div>
//             <p className="text-gray-500">Status</p>

//             <span
//               className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${status.className}`}
//             >
//               {status.icon} {token.status.toUpperCase()}
//             </span>
//           </div>

//         </div>

//         <hr className="my-6 border-gray-200" />

//         {/* Current Serving (Optional) */}
//         {token.currentServing && (
//           <>
//             <div className="text-center">
//               <p className="text-gray-500">
//                 Current Serving
//               </p>

//               <h2 className="text-3xl font-bold text-indigo-600">
//                 {token.currentServing}
//               </h2>
//             </div>

//             <hr className="my-6 border-gray-200" />
//           </>
//         )}

//         {/* Hero Token */}
//         <div className="text-center">
//           <p className="text-gray-500">
//             Your Token Number
//           </p>

//           <h1 className="mt-2 text-6xl font-extrabold text-primary">
//             {token.tokenNumber}
//           </h1>
//         </div>

//         <hr className="my-6 border-gray-200" />

//         {/* People Ahead & Wait */}
//         <div className="grid grid-cols-2 gap-6">

//           <div>
//             <p className="text-gray-500">
//               People Ahead
//             </p>

//             <h2 className="text-2xl font-semibold">
//               {token.peopleAhead}
//             </h2>
//           </div>

//           <div>
//             <p className="text-gray-500">
//               Estimated Wait
//             </p>

//             <h2 className="text-2xl font-semibold">
//               {token.estimatedWait} mins
//             </h2>
//           </div>

//         </div>

//         <hr className="my-6 border-gray-200" />

//         {/* Booked Time */}
//         <div className="grid grid-cols-2 gap-6">

//           <div>
//             <p className="text-gray-500">
//               Booked Date
//             </p>

//             <h2 className="font-semibold">
//               {formattedDate}
//             </h2>
//           </div>

//           <div>
//             <p className="text-gray-500">
//               Booked Time
//             </p>

//             <h2 className="font-semibold">
//               {formattedTime}
//             </h2>
//           </div>

//         </div>

//         {token.status === "waiting" && (
//           <Button
//             className="mb-4 w-full bg-red-600 hover:bg-red-700"
//             onClick={() => setShowCancelModal(true)}
//           >
//             Cancel Token
//           </Button>
//         )}

//         <Button
//           className="mt-10 w-full"
//           onClick={() => navigate("/user/dashboard")}
//         >
//           Back to Dashboard
//         </Button>

//       </div>
//       <ConfirmModal
//         isOpen={showCancelModal}
//         title="Cancel Token"
//         message="Are you sure you want to cancel your token?"
//         confirmText="Yes, Cancel"
//         cancelText="No"
//         onCancel={() => setShowCancelModal(false)}
//         onConfirm={() => {
//           setShowCancelModal(false);
//           handleCancelToken();
//         }}
//       />
//     </div>
//     </>
//   );
// };

// export default MyToken;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Clock3,
  CalendarDays,
  Timer,
  Activity,
} from "lucide-react";

import api from "../../services/api";
import Button from "../../components/common/Button";
import socket from "../../socket/socket";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import Navbar from "../../components/common/Navbar";

const MyToken = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchMyToken = async () => {
    try {
      const response = await api.get("/tokens/my-token");
      setToken(response.data.token);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        setToken(null);
      } else {
        toast.error("Failed to load token");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelToken = async () => {
    try {
      const response = await api.patch("/tokens/cancel", {
        tokenId: token._id,
      });

      toast.success(response.data.message);

      navigate("/user/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to cancel token"
      );
    }
  };

  useEffect(() => {
    fetchMyToken();

    socket.on("queueUpdated", fetchMyToken);

    return () => socket.off("queueUpdated");
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="mx-auto mb-4 h-10 w-10 animate-pulse text-primary" />
          <h2 className="text-xl font-semibold text-secondary">
            Loading your token...
          </h2>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 px-6">

          <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">

              🎫

            </div>

            <h2 className="text-3xl font-bold text-secondary">
              No Active Token
            </h2>

            <p className="mt-3 text-gray-500">
              You don't have any active token right now.
            </p>

            <Button
              className="mt-8 w-full"
              onClick={() => navigate("/user/dashboard")}
            >
              Back to Dashboard
            </Button>

          </div>

        </div>
      </>
    );
  }

  const bookedDate = new Date(token.bookedAt);

  const formattedDate = bookedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = bookedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusConfig = {
    waiting: {
      icon: "🟡",
      className: "bg-yellow-100 text-yellow-700",
    },
    serving: {
      icon: "🔵",
      className: "bg-blue-100 text-blue-700",
    },
    completed: {
      icon: "🟢",
      className: "bg-green-100 text-green-700",
    },
    cancelled: {
      icon: "🔴",
      className: "bg-red-100 text-red-700",
    },
  };

  const status =
    statusConfig[token.status] || statusConfig.cancelled;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 px-6 py-10">

        <div className="mx-auto max-w-2xl">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-secondary sm:text-5xl">
              Your Queue Pass
            </h1>

            <p className="mt-2 text-gray-500">
              Live queue updates enabled
            </p>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow-2xl">

            {/* Queue & Status */}

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border bg-slate-50 p-5">

                <p className="text-sm text-gray-500">
                  Queue
                </p>

                <h2 className="mt-2 text-2xl font-bold text-secondary">
                  {token.queue.name}
                </h2>

              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
                >
                  {status.icon}
                  {token.status.toUpperCase()}
                </span>

              </div>

            </div>

            {/* Hero Card */}

            <div className="my-8 rounded-3xl bg-gradient-to-r from-primary to-teal-400 p-10 text-center text-white shadow-lg">

              <p className="text-sm uppercase tracking-[5px] opacity-80">
                Your Token Number
              </p>

              <h1 className="mt-3 text-5xl font-black tracking-wider sm:text-7xl">
                {token.tokenNumber}
              </h1>

            </div>

            {/* Statistics */}

            <div className="grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      People Ahead
                    </p>

                    <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                      {token.peopleAhead}
                    </h2>
                  </div>

                </div>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-primary/10 p-3">
                    <Clock3 className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Estimated Wait
                    </p>

                    <h2 className="text-2xl font-bold text-secondary sm:text-3xl">
                      {token.estimatedWait} mins
                    </h2>
                  </div>

                </div>

              </div>

            </div>

            {/* Booking Details */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <CalendarDays className="text-primary" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Booked Date
                    </p>

                    <h2 className="text-lg font-semibold text-secondary">
                      {formattedDate}
                    </h2>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <Timer className="text-primary" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Booked Time
                    </p>

                    <h2 className="text-lg font-semibold text-secondary">
                      {formattedTime}
                    </h2>

                  </div>

                </div>

              </div>

            </div>

            {/* Current Serving */}

            {token.currentServing && (

              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">

                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Current Serving
                </p>

                <h2 className="mt-2 text-4xl font-black text-primary sm:text-5xl">
                  {token.currentServing}
                </h2>

              </div>

            )}

            {/* Buttons */}

            <div className="mt-10 space-y-4">

              {token.status === "waiting" && (

                <Button
                  className="w-full rounded-xl bg-red-600 py-4 text-lg hover:bg-red-700"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Token
                </Button>

              )}

              <Button
                className="w-full rounded-xl py-4 text-lg"
                onClick={() => navigate("/user/dashboard")}
              >
                Back to Dashboard
              </Button>

            </div>

          </div>

        </div>

        <ConfirmModal
          isOpen={showCancelModal}
          title="Cancel Token"
          message="Are you sure you want to cancel your token?"
          confirmText="Yes, Cancel"
          cancelText="No"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => {
            setShowCancelModal(false);
            handleCancelToken();
          }}
        />

      </div>

    </>
  );
};

export default MyToken;